import os
import sys

# Add the parent directory to sys.path to allow imports from api._utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Blueprint, request, jsonify, g
from api._utils.supabase_client import get_supabase_client
from api._utils.auth_helpers import require_auth
from api._utils.validators import validate_profile_update
from api._utils.f1_presets import get_session_name

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/api/profile', methods=['GET', 'PUT'])
@require_auth
def profile():
    """Handle profile fetch and update (both authenticated)."""
    if request.method == 'GET':
        return _get_profile()
    elif request.method == 'PUT':
        return _update_profile()
    return jsonify({"success": False, "error": "Method not allowed"}), 405

@profile_bp.route('/api/profile/avatar', methods=['POST', 'DELETE'])
@require_auth
def manage_avatar():
    """Handle uploading or deleting a profile picture."""
    if request.method == 'POST':
        return upload_avatar()
    elif request.method == 'DELETE':
        return delete_avatar()
    return jsonify({"success": False, "error": "Method not allowed"}), 405

def upload_avatar():
    """Handle uploading a new profile picture."""
    try:
        user = g.current_user
        
        if 'file' not in request.files:
            return jsonify({"success": False, "error": "No file part in the request"}), 400
            
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"success": False, "error": "No selected file"}), 400
            
        if not file.content_type.startswith('image/'):
            return jsonify({"success": False, "error": "File is not an image"}), 400
            
        # Optional: restrict size (e.g., to 5MB)
        file.seek(0, os.SEEK_END)
        file_length = file.tell()
        file.seek(0, os.SEEK_SET) # reset pointer 
        if file_length > 5 * 1024 * 1024:
            return jsonify({"success": False, "error": "Image file is too large (max 5MB)"}), 400
        
        import uuid
        # Generate a unique filename using UUID
        ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else 'jpg'
        filename = f"{user['id']}/{uuid.uuid4()}.{ext}"
        
        supabase = get_supabase_client()
        
        # Read the file content
        file_data = file.read()
        
        # Upload to Supabase Storage (requires a public bucket named 'avatars')
        res = supabase.storage.from_("avatars").upload(
            file=file_data,
            path=filename,
            file_options={"content-type": file.content_type, "upsert": "true"}
        )
        
        # Get the public URL for the uploaded file
        public_url = supabase.storage.from_("avatars").get_public_url(filename)
        
        # Update the user's profile with the new avatar_url
        update_result = (
            supabase.table("users")
            .update({"avatar_url": public_url})
            .eq("id", user["id"])
            .execute()
        )
        
        if not update_result.data:
             return jsonify({"success": False, "error": "Failed to update user profile with image URL"}), 500
            
        return jsonify({"success": True, "avatar_url": public_url}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": f"Server error: {str(e)}"}), 500

def delete_avatar():
    """Handle deleting the current profile picture."""
    try:
        user = g.current_user
        supabase = get_supabase_client()
        
        # 1. Get the current avatar_url
        res = supabase.table("users").select("avatar_url").eq("id", user["id"]).single().execute()
        
        if not res.data or not res.data.get("avatar_url"):
            return jsonify({"success": True, "message": "No avatar to delete"}), 200
            
        avatar_url = res.data["avatar_url"]
        
        # 2. Extract the file path from the URL
        # URL format: .../storage/v1/object/public/avatars/USER_ID/FILENAME.ext
        # We need everything after "/avatars/"
        try:
            path = avatar_url.split("/avatars/")[1]
        except (IndexError, AttributeError):
            # If URL format is unexpected, just nullify the DB entry
            path = None
            
        # 3. Delete from storage if path exists
        if path:
            supabase.storage.from_("avatars").remove([path])
            
        # 4. Nullify the avatar_url in the database
        update_res = (
            supabase.table("users")
            .update({"avatar_url": None})
            .eq("id", user["id"])
            .execute()
        )
        
        if not update_res.data:
            return jsonify({"success": False, "error": "Failed to update user profile"}), 500
            
        return jsonify({"success": True, "message": "Avatar deleted successfully"}), 200
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": f"Server error: {str(e)}"}), 500

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

        # 2. Fetch data from leaderboard for the user
        lb_res = (
            supabase.table("leaderboard")
            .select("total_points, avg_points_per_race, rank, races_predicted")
            .eq("user_id", user["id"])
            .eq("season", active_season)
            .single()
            .execute()
        )

        # 3. Fetch leader points from leaderboard
        leader_points_res = (
            supabase.table("leaderboard")
            .select("total_points")
            .eq("season", active_season)
            .eq("rank", 1)
            .single()
            .execute()
        )

        # 4. Fetch best finish
        best_finish_res = (
            supabase.table("points_log")
            .select("total_points, races(round), session_type")
            .eq("user_id", user["id"])
            .eq("season", active_season)
            .order("total_points", desc=True)
            .limit(1)
            .execute()
        )

        # 5. Fetch worst finish
        worst_finish_res = (
            supabase.table("points_log")
            .select("total_points, races(round), session_type")
            .eq("user_id", user["id"])
            .eq("season", active_season)
            .order("total_points", desc=False)
            .limit(1)
            .execute()
        )

        # 6a. Fetch total completed races and sprints for this season
        completed_races_res = (
            supabase.table("races")
            .select("id", count="exact")
            .eq("season", active_season)
            .eq("status", "completed")
            .execute()
        )
        total_completed_races = completed_races_res.count if completed_races_res.count is not None else 0

        completed_sprints_res = (
            supabase.table("sprints")
            .select("id", count="exact")
            .eq("season", active_season)
            .eq("status", "completed")
            .execute()
        )
        total_completed_sprints = completed_sprints_res.count if completed_sprints_res.count is not None else 0
        total_completed_events = total_completed_races + total_completed_sprints

        stats = {
            "rank": 0,
            "total_points": 0,
            "avg_points": 0.0,
            "points_behind_leader": 0,
            "best_finish": "-",
            "worst_finish": "-",
            "races_predicted": 0,
            "total_completed_races": total_completed_events,
            "accuracyBars": {
                "Driver Predictions": 0,
                "Constructor Predictions": 0,
                "Bonus Predictions": 0,
            }
        }
   
        if lb_res.data:
            stats["rank"] = lb_res.data['rank'] if lb_res.data['rank'] else 0
            stats["total_points"] = lb_res.data['total_points'] or 0
            stats["avg_points"] = float(lb_res.data['avg_points_per_race'] or 0)
            
            leader_pts = leader_points_res.data.get('total_points', 0) if (leader_points_res and leader_points_res.data) else 0
            stats["points_behind_leader"] = max(0, leader_pts - stats["total_points"])

        # 6b. Fetch points_log breakdown from a user to aggregate them and get the accuracy bar data
        points_log_res = (
            supabase.table("points_log")
            .select("breakdown, session_type")
            .eq("user_id", user["id"])
            .eq("season", active_season)
            .execute()
        )

        # Calculate races_predicted (which here actually means 'events predicted') based on points_log entries
        if points_log_res and points_log_res.data:
            predicted_events = [item for item in points_log_res.data if item.get("session_type") in ("race", "sprint")]
            stats["races_predicted"] = len(predicted_events)


        # 7. Safe lookup for best/worst finish names
        if best_finish_res.data:
            b_entry = best_finish_res.data[0]
            b_round = b_entry.get("races", {}).get("round")
            b_session = b_entry.get("session_type", "race")
            stats["best_finish"] = get_session_name(b_round, b_session) if b_round else "-"

        if worst_finish_res.data:
            w_entry = worst_finish_res.data[0]
            w_round = w_entry.get("races", {}).get("round")
            w_session = w_entry.get("session_type", "race")
            stats["worst_finish"] = get_session_name(w_round, w_session) if w_round else "-"

        # 8. Aggregating accuracy bars (percentage of total points per category)
        total_driver = 0
        total_constructor = 0
        total_bonus = 0
        
        for item in points_log_res.data:
            bd = item.get("breakdown") or {}
            total_driver += bd.get("driver_points", 0)
            total_constructor += bd.get("constructor_points", 0)
            total_bonus += bd.get("bonus_points", 0)
        
        if stats["total_points"] > 0:
            stats["accuracyBars"] = {
                "Driver Predictions": round((total_driver / stats["total_points"]) * 100),
                "Constructor Predictions": round((total_constructor / stats["total_points"]) * 100),
                "Bonus Predictions": round((total_bonus / stats["total_points"]) * 100),
            }
            
        return jsonify({"success": True, "stats": stats}), 200

    except Exception as e:
        print(f"Error in get_season_stats: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@profile_bp.route('/api/profile/cards-stats', methods=['GET'])
@require_auth
def get_cards_stats():
    """Fetch driver and constructor stats for profile cards including standings and recent results."""
    try:
        supabase = get_supabase_client()
        
        team_id = request.args.get('team_id')
        driver_id = request.args.get('driver_id')
        
        if not team_id or not driver_id:
            return jsonify({"success": False, "error": "team_id and driver_id are required"}), 400

        # 1. Fetch current active season
        season_res = supabase.table("seasons").select("year").eq("is_active", True).limit(1).execute()
        if not season_res.data:
            return jsonify({"success": False, "error": "No active season found"}), 404
        active_season = season_res.data[0]["year"]

        # 2. Fetch driver standings
        ds_res = supabase.table("driver_standings").select("points, position").eq("season", active_season).eq("driver_id", driver_id).execute()
        driver_standings_pos = ds_res.data[0]["position"] if ds_res.data else "-"
        driver_standings_points = ds_res.data[0]["points"] if ds_res.data else 0

        # 3. Fetch constructor standings
        cs_res = supabase.table("constructor_standings").select("points, position").eq("season", active_season).eq("constructor_id", team_id).execute()
        constructor_standings_pos = cs_res.data[0]["position"] if cs_res.data else "-"
        constructor_standings_points = cs_res.data[0]["points"] if cs_res.data else 0

        # 4. Fetch race results
        results_res = (
            supabase.table("race_results")
            .select("*, races!inner(round)")
            .eq("races.season", active_season)
            .order("races(round)", desc=False)
            .execute()
        )
        
        driver_stats = {"wins": 0, "podiums": 0, "poles": 0}
        constructor_stats = {"wins": 0, "podiums": 0, "poles": 0}
        
        driver_recent = []
        constructor_recent = []
        
        for r in results_res.data:
            # Driver logic
            d_pos = "-"
            is_podium = False
            if r.get("p1_driver") == driver_id:
                driver_stats["wins"] += 1
                is_podium = True
                d_pos = "1st"
            elif r.get("p2_driver") == driver_id:
                is_podium = True
                d_pos = "2nd"
            elif r.get("p3_driver") == driver_id:
                is_podium = True
                d_pos = "3rd"
            elif r.get("p4_driver") == driver_id: d_pos = "4th"
            elif r.get("p5_driver") == driver_id: d_pos = "5th"
            elif r.get("p6_driver") == driver_id: d_pos = "6th"
            elif r.get("p7_driver") == driver_id: d_pos = "7th"
            elif r.get("p8_driver") == driver_id: d_pos = "8th"
            elif r.get("p9_driver") == driver_id: d_pos = "9th"
            elif r.get("p10_driver") == driver_id: d_pos = "10th"
            else:
                d_pos = "NP" # No Points
                
            if is_podium:
                driver_stats["podiums"] += 1
                
            if r.get("pole_position") == driver_id:
                driver_stats["poles"] += 1
                
            driver_recent.append(d_pos)
            
            # Constructor logic
            c_pos = "-"
            c_is_podium = False
            if r.get("c1_constructor") == team_id:
                constructor_stats["wins"] += 1
                c_is_podium = True
                c_pos = "1st"
            elif r.get("c2_constructor") == team_id:
                c_is_podium = True
                c_pos = "2nd"
            elif r.get("c3_constructor") == team_id:
                c_is_podium = True
                c_pos = "3rd"
            elif r.get("c4_constructor") == team_id: c_pos = "4th"
            elif r.get("c5_constructor") == team_id: c_pos = "5th"
            elif r.get("c6_constructor") == team_id: c_pos = "6th"
            elif r.get("c7_constructor") == team_id: c_pos = "7th"
            elif r.get("c8_constructor") == team_id: c_pos = "8th"
            elif r.get("c9_constructor") == team_id: c_pos = "9th"
            elif r.get("c10_constructor") == team_id: c_pos = "10th"
            else:
                c_pos = "OUT"
                
            if c_is_podium:
                constructor_stats["podiums"] += 1
                
            constructor_recent.append(c_pos)
        
        # Keep last 5 elements
        driver_recent = driver_recent[-5:]
        constructor_recent = constructor_recent[-5:]

        data = {
            "constructor": {
                "standingsPos": constructor_standings_pos,
                "standingsPoints": constructor_standings_points,
                "seasonStats": constructor_stats,
                "recentResults": constructor_recent
            },
            "driver": {
                "standingsPos": driver_standings_pos,
                "standingsPoints": driver_standings_points,
                "seasonStats": driver_stats,
                "recentResults": driver_recent
            }
        }
        
        return jsonify({"success": True, "data": data}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500

def _get_profile():
    #Fetch the authenticated user's profile
    try:
        user = g.current_user
        supabase = get_supabase_client()

        result = (
            supabase.table("users")
            .select("username, display_name, avatar_url, favorite_team_id, favorite_driver_id, created_at")
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
