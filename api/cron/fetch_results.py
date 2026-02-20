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

# Add the parent directory to sys.path to allow imports from api._utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/api/cron/fetch-results', methods=['GET'])
def cron_fetch_results():
    """
    Vercel cron job: auto-fetch results after races.
    
    Steps:
        1. Verify CRON_SECRET from Authorization header
        2. Query races with status='locked' and cutoff < now
        3. For each, check if race_results entry exists
        4. If not, use f1_api to fetch and store results
        5. Trigger points calculation
        6. Update race status to 'completed'
        7. Refresh leaderboard
    """
    # TODO: Implement cron job logic
    pass
