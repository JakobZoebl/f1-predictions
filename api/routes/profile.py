import os
import sys

# Add the parent directory to sys.path to allow imports from api._utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Blueprint, request, jsonify, g
from api._utils.supabase_client import get_supabase_client
from api._utils.auth_helpers import require_auth
from api._utils.validators import validate_profile_update

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/api/profile', methods=['GET', 'PUT'])
@require_auth
def profile():
    """Handle profile fetch and update (both authenticated)."""
    if request.method == 'GET':
        return _get_profile()
    else:
        return _update_profile()

@profile_bp.route('/api/profile/season-stats', methods=['GET'])
@require_auth
def get_season_stats():
    """Fetch consolidated season statistics for the user."""
    try:
        user = g.current_user
        supabase = get_supabase_client()

        # 1. Fetch current active season
        season_res = supabase.table("seasons").select("year").eq("is_active", True).limit(1).execute()
        if not season_res.data:
            return jsonify({"success": False, "error": "No active season found"}), 404
        
        active_season = season_res.data[0]["year"]

        # 2. Fetch data from leaderboard for the active season
        lb_res = (
            supabase.table("leaderboard")
            .select("total_points, avg_points_per_race, rank, races_predicted")
            .eq("user_id", user["id"])
            .eq("season", active_season)
            .single()
            .execute()
        )

        # 3. Fetch latest points_log entry for "Last Race" info
        last_race_res = (
            supabase.table("points_log")
            .select("total_points, races(name)")
            .eq("user_id", user["id"])
            .eq("season", active_season)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        # 4. Fetch total completed (or at least status != 'upcoming') races to show progress
        total_races_res = (
            supabase.table("races")
            .select("id", count="exact")
            .eq("season", active_season)
            .neq("status", "upcoming")
            .execute()
        )
        total_completed_races = total_races_res.count if total_races_res.count is not None else 0

        # 5. Fetch best finish (highest rank in any race result)
        # This is slightly tricky as we don't have a 'rank' per race in points_log yet if not implemented,
        # but the prompt's mockup shows "Best Finish: #2". 
        # For now, let's assume we fetch the minimum rank from somewhere or return a placeholder if not available.
        # Actually, let's look for the highest points in a single race as a proxy or just leave it for now.
        best_finish = "-" 

        stats = {
            "rank": "-",
            "total_points": 0,
            "avg_points": 0.0,
            "races_predicted": 0,
            "total_completed_races": total_completed_races,
            "last_race": {
                "name": "-",
                "points": "-"
            },
            "best_finish": best_finish
        }

        if lb_res.data:
            stats["rank"] = f"#{lb_res.data['rank']}" if lb_res.data['rank'] else "-"
            stats["total_points"] = lb_res.data['total_points'] or 0
            stats["avg_points"] = float(lb_res.data['avg_points_per_race'] or 0)
            stats["races_predicted"] = lb_res.data['races_predicted'] or 0

        if last_race_res.data:
            entry = last_race_res.data[0]
            race_name = entry.get("races", {}).get("name", "Unknown")
            stats["last_race"] = {
                "name": race_name,
                "points": entry["total_points"]
            }

        return jsonify({"success": True, "stats": stats}), 200

    except Exception as e:
        print(f"Error in get_season_stats: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

def _get_profile():
    #Fetch the authenticated user's profile
    try:
        user = g.current_user
        supabase = get_supabase_client()

        result = (
            supabase.table("users")
            .select("username, display_name, favorite_team_id, favorite_driver_id, created_at")
            .eq("id", user["id"])
            .single()
            .execute()
        )

        if not result.data:
            return jsonify({"success": False, "error": "Profile not found."}), 404

        profile_data = result.data
        profile_data["email"] = user["email"]

        return jsonify({"success": True, "profile": profile_data}), 200

    except Exception as e:
        return jsonify({"success": False, "error": f"Server error: {str(e)}"}), 500

def _update_profile():
    """Update the authenticated user's profile (name, preferences, and/or password)."""
    try:
        user = g.current_user
        data = request.get_json()

        if not data:
            return jsonify({"success": False, "error": "Request body is required."}), 400

        # Build update payload for the users table
        update_data = {}
        
        if "display_name" in data:
            update_data["display_name"] = data["display_name"].strip()
            
        if "favorite_team_id" in data:
            val = data["favorite_team_id"]
            if val is not None and not isinstance(val, str):
                return jsonify({"success": False, "error": "favorite_team_id must be a string."}), 400
            update_data["favorite_team_id"] = val
            
        if "favorite_driver_id" in data:
            val = data["favorite_driver_id"]
            if val is not None and not isinstance(val, str):
                return jsonify({"success": False, "error": "favorite_driver_id must be a string."}), 400
            update_data["favorite_driver_id"] = val

        supabase = get_supabase_client()
        updated_profile = {}

        # 1. Handle standard profile fields (display_name, favorites)
        if update_data:
            result = (
                supabase.table("users")
                .update(update_data)
                .eq("id", user["id"])
                .execute()
            )
            if not result.data:
                return jsonify({"success": False, "error": "Failed to update profile data."}), 500
            updated_profile = result.data[0]

        # 2. Handle password updates simultaneously if provided
        new_password = data.get("password", "")
        if new_password:
            if len(new_password) < 8:
                return jsonify({
                    "success": False,
                    "error": "Password must be at least 8 characters."
                }), 400
                
            supabase.auth.admin.update_user_by_id(
                user["id"],
                {"password": new_password}
            )

        if not update_data and not new_password:
             return jsonify({"success": False, "error": "No valid fields to update."}), 400

        return jsonify({"success": True, "profile": updated_profile}), 200

    except Exception as e:
        return jsonify({"success": False, "error": f"Server error: {str(e)}"}), 500
