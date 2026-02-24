"""
GET /api/cron/fetch-results

Vercel Cron job endpoint — automatically fetch race results after races.

Configured in vercel.json:
    {
        "crons": [{
            "path": "/api/cron/fetch-results",
            "schedule": "0 */2 * * 0"  // Every 2 hours on Sundays
        }]
    }

Headers required:
    Authorization: Bearer <CRON_SECRET>

Process:
    1. Verify cron secret
    2. Find races where status='locked' and cutoff has passed
    3. For each race without results:
       a. Fetch from Jolpica API
       b. Save results
       c. Calculate points for all users
       d. Update race status to 'completed'
    4. Refresh leaderboard materialized view

Response:
    {
        "success": true,
        "races_processed": 1,
        "errors": []
    }

Error responses:
    401 - Invalid cron secret
    500 - Server error
"""

import os
import sys
import datetime

# Add the parent directory to sys.path to allow imports from api._utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Flask, request, jsonify
from api._utils.supabase_client import get_supabase_client
from api._utils.f1_api import fetch_race_results, fetch_sprint_results

app = Flask(__name__)

@app.route('/api/cron/fetch-results', methods=['GET'])
def cron_fetch_results():
    """
    Vercel cron job: auto-fetch results after races.
    """
    cron_secret = os.environ.get("CRON_SECRET")
    auth_header = request.headers.get("Authorization")
    
    if cron_secret and auth_header != f"Bearer {cron_secret}":
        return jsonify({"success": False, "error": "Unauthorized"}), 401

    try:
        supabase = get_supabase_client()
        now_iso = datetime.datetime.utcnow().isoformat()
        
        processed_races = 0
        processed_sprints = 0
        errors = []

        # 1. Check for completed sprints that need results
        # We look for sprints whose date has passed and status is not 'completed'
        sprints_res = supabase.table("sprints").select("*").neq("status", "completed").lt("date", now_iso).execute()
        
        for sprint in sprints_res.data:
            sprint_id = sprint["id"]
            race_id = sprint["race_id"]
            season = sprint["season"]
            round_num = sprint["round"]
            
            # Fetch results from Jolpica
            results = fetch_sprint_results(season, round_num)
            
            if results:
                # Add race_id to the results object before inserting
                results["race_id"] = race_id
                try:
                    # Insert into sprint_results. This triggers calculate_f1_points() in DB
                    supabase.table("sprint_results").upsert(results).execute()
                    # Mark sprint as completed
                    supabase.table("sprints").update({"status": "completed"}).eq("id", sprint_id).execute()
                    processed_sprints += 1
                except Exception as e:
                    errors.append(f"Sprint {round_num} error: {str(e)}")

        # 2. Check for completed races that need results
        races_res = supabase.table("races").select("*").neq("status", "completed").lt("date", now_iso).execute()
        
        for race in races_res.data:
            race_id = race["id"]
            season = race["season"]
            round_num = race["round"]
            
            results = fetch_race_results(season, round_num)
            
            if results:
                results["race_id"] = race_id
                try:
                    # Insert into race_results. This triggers calculate_f1_points() in DB
                    supabase.table("race_results").upsert(results).execute()
                    # Mark race as completed
                    supabase.table("races").update({"status": "completed"}).eq("id", race_id).execute()
                    processed_races += 1
                except Exception as e:
                    errors.append(f"Race {round_num} error: {str(e)}")
                    
        return jsonify({
            "success": True, 
            "races_processed": processed_races,
            "sprints_processed": processed_sprints,
            "errors": errors
        }), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500
