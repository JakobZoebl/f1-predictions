import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Blueprint, jsonify, request, g
from api._utils.supabase_client import get_supabase_client
from api._utils.auth_helpers import require_auth

results_bp = Blueprint('results', __name__)

@results_bp.route('/api/results/last', methods=['GET'])
def get_last_race_results():
    try:
        supabase = get_supabase_client()
        user = None
        
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
            try:
                auth_res = supabase.auth.get_user(token)
                if auth_res and auth_res.user:
                    user = {"id": auth_res.user.id}
            except Exception:
                pass

        # Get latest race that has results
        results_res = (
            supabase.table("race_results")
            .select("*, races(*)")
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        if not results_res.data:
            return jsonify({"success": True, "results": [], "race": None}), 200
             
        actual = results_res.data[0]
        race_info = actual.get('races', {})
        race_id = actual.get('race_id')

        # Get user's prediction for this race
        pred = {}
        if user:
            pred_res = (
                supabase.table("predictions")
                .select("*")
                .eq("user_id", user["id"])
                .eq("race_id", race_id)
                .execute()
            )
            pred = pred_res.data[0] if pred_res.data else {}

        output_rows = []

        # Helper to format response items
        def add_row(category, position, act_val, pred_val, points, team=""):
            output_rows.append({
                "Category": category,
                "Position": str(position),
                "Actual": act_val or "",
                "Predicted": pred_val or "",
                "Points": str(points),
                "Team": team,
                "Details": ""
            })

        actual_drivers = [
            actual.get(f"p{i}_driver") for i in range(1, 11)
        ]
        
        # 1. DRIVERS (RESULT)
        driver_points_map = {1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2, 10: 1}
        for i in range(1, 11):
            act_d = actual.get(f"p{i}_driver")
            pred_d = pred.get(f"p{i}_driver")
            pts = 0
            if pred_d:
                if pred_d == act_d:
                    pts = driver_points_map[i]
                elif pred_d in actual_drivers:
                    pts = 2
            add_row("RESULT", i, act_d, pred_d, pts)

        # 2. CONSTRUCTORS
        actual_constructors = [
            actual.get(f"c{i}_constructor") for i in range(1, 6)
        ]
        constructor_points_map = {1: 25, 2: 18, 3: 15, 4: 12, 5: 10}
        for i in range(1, 6):
            act_c = actual.get(f"c{i}_constructor")
            pred_c = pred.get(f"c{i}_constructor")
            pts = 0
            if pred_c:
                if pred_c == act_c:
                    pts = constructor_points_map[i]
                elif pred_c in actual_constructors:
                    pts = 10
            add_row("CONSTRUCTOR", i, act_c, pred_c, pts)

        # 3. BONUS
        bonuses = [
            ("pole_position", 10),
            ("fastest_lap", 10),
            ("first_retirement", 10)
        ]
        for key, max_pts in bonuses:
            act_b = actual.get(key)
            pred_b = pred.get(key)
            pts = max_pts if (pred_b and pred_b == act_b) else 0
            add_row("BONUS", key, act_b, pred_b, pts)

        # Booleans
        for key in ["safety_car", "red_flag"]:
            act_b = actual.get(key)
            pred_b = pred.get(key)
            pts = 0
            if pred_b is not None and pred_b == act_b:
                if key == "safety_car":
                    pts = 5
                elif key == "red_flag":
                    pts = 5 if act_b is True else 1
            
            add_row("BONUS", key, "Yes" if act_b else "No", "Yes" if pred_b else ("No" if pred is not None and key in pred and pred[key] is not None else ""), pts)

        # 4. LEADERBOARD
        # Fetch leaderboard for this race specifically, from points_log
        lb_res = (
            supabase.table("points_log")
            .select("total_points, users(username)")
            .eq("race_id", race_id)
            .order("total_points", desc=True)
            .limit(10)
            .execute()
        )
        
        if lb_res.data:
            for idx, entry in enumerate(lb_res.data):
                username = entry.get('users', {}).get('username', 'Unknown')
                pts = entry.get('total_points', 0)
                add_row("LEADERBOARD", idx + 1, "", "", pts, team=username)

        return jsonify({"success": True, "results": output_rows, "race": race_info}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500

@results_bp.route('/api/results/last-sprint', methods=['GET'])
def get_last_sprint_results():
    try:
        supabase = get_supabase_client()
        user = None
        
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
            try:
                auth_res = supabase.auth.get_user(token)
                if auth_res and auth_res.user:
                    user = {"id": auth_res.user.id}
            except Exception:
                pass

        # Get latest sprint that has results
        results_res = (
            supabase.table("sprint_results")
            .select("*, races(*)")
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        if not results_res.data:
            return jsonify({"success": True, "results": [], "race": None}), 200
             
        actual = results_res.data[0]
        race_info = actual.get('races', {})
        race_id = actual.get('race_id')

        # Get user's prediction for this sprint
        pred = {}
        if user:
            pred_res = (
                supabase.table("sprint_predictions")
                .select("*")
                .eq("user_id", user["id"])
                .eq("race_id", race_id)
                .execute()
            )
            pred = pred_res.data[0] if pred_res.data else {}

        output_rows = []

        # Helper to format response items
        def add_row(category, position, act_val, pred_val, points, team=""):
            output_rows.append({
                "Category": category,
                "Position": str(position),
                "Actual": act_val or "",
                "Predicted": pred_val or "",
                "Points": str(points),
                "Team": team,
                "Details": ""
            })

        actual_drivers = [
            actual.get(f"sp{i}_driver") for i in range(1, 9)
        ]
        
        # 1. DRIVERS (RESULT) - Top 8 for sprints
        driver_points_map = {1: 8, 2: 7, 3: 6, 4: 5, 5: 4, 6: 3, 7: 2, 8: 1}
        for i in range(1, 9):
            act_d = actual.get(f"sp{i}_driver")
            pred_d = pred.get(f"sp{i}_driver")
            pts = 0
            if pred_d:
                if pred_d == act_d:
                    pts = driver_points_map[i]
                elif pred_d in actual_drivers:
                    pts = 1
            add_row("RESULT", i, act_d, pred_d, pts)

        # 2. CONSTRUCTORS - Top 5 for sprints
        actual_constructors = [
            actual.get(f"c{i}_constructor") for i in range(1, 6)
        ]
        constructor_points_map = {1: 8, 2: 7, 3: 6, 4: 5, 5: 4}
        for i in range(1, 6):
            act_c = actual.get(f"c{i}_constructor")
            pred_c = pred.get(f"c{i}_constructor")
            pts = 0
            if pred_c:
                if pred_c == act_c:
                    pts = constructor_points_map[i]
                elif pred_c in actual_constructors:
                    pts = 4
            add_row("CONSTRUCTOR", i, act_c, pred_c, pts)

        # 3. BONUS
        bonuses = [
            ("pole_position", 10),
            ("fastest_lap", 10),
            ("first_retirement", 10)
        ]
        for key, max_pts in bonuses:
            act_b = actual.get(key)
            pred_b = pred.get(key)
            pts = max_pts if (pred_b and pred_b == act_b) else 0
            add_row("BONUS", key, act_b, pred_b, pts)

        # Booleans
        for key in ["safety_car", "red_flag"]:
            act_b = actual.get(key)
            pred_b = pred.get(key)
            pts = 0
            if pred_b is not None and pred_b == act_b:
                if key == "safety_car":
                    pts = 5
                elif key == "red_flag":
                    pts = 5 if act_b is True else 1
            
            add_row("BONUS", key, "Yes" if act_b else "No", "Yes" if pred_b else ("No" if pred is not None and key in pred and pred[key] is not None else ""), pts)

        # 4. LEADERBOARD
        # Fetch leaderboard for this sprint specifically, from points_log with session_type='sprint'
        lb_res = (
            supabase.table("points_log")
            .select("total_points, users(username)")
            .eq("race_id", race_id)
            .eq("session_type", "sprint")
            .order("total_points", desc=True)
            .limit(10)
            .execute()
        )
        
        if lb_res.data:
            for idx, entry in enumerate(lb_res.data):
                username = entry.get('users', {}).get('username', 'Unknown')
                pts = entry.get('total_points', 0)
                add_row("LEADERBOARD", idx + 1, "", "", pts, team=username)

        return jsonify({"success": True, "results": output_rows, "race": race_info}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500
        
@results_bp.route('/api/results/season', methods=['GET'])
def get_season_results():
    try:
        supabase = get_supabase_client()
        user = None
        
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
            try:
                auth_res = supabase.auth.get_user(token)
                if auth_res and auth_res.user:
                    user = {"id": auth_res.user.id}
            except Exception:
                pass

        # Get active season
        season_res = (
            supabase.table("seasons")
            .select("*")
            .eq("is_active", True)
            .order("year", desc=True)
            .limit(1)
            .execute()
        )
        
        if not season_res.data:
            # Fallback to latest year if no season is active
            season_res = (
                supabase.table("seasons")
                .select("*")
                .order("year", desc=True)
                .limit(1)
                .execute()
            )
            
        if not season_res.data:
            return jsonify({"success": False, "error": "No season found"}), 404
            
        active_season = season_res.data[0]
        year = active_season['year']

        # Get season results
        results_res = (
            supabase.table("season_results")
            .select("*")
            .eq("season", year)
            .execute()
        )

        if not results_res.data:
            return jsonify({"success": True, "results": [], "season": year}), 200
             
        actual = results_res.data[0]

        # Get user's season prediction
        pred = {}
        if user:
            pred_res = (
                supabase.table("season_predictions")
                .select("*")
                .eq("user_id", user["id"])
                .eq("season", year)
                .execute()
            )
            pred = pred_res.data[0] if pred_res.data else {}

        output_rows = []

        # Helper to format response items
        def add_row(category, position, act_val, pred_val, points, team=""):
            output_rows.append({
                "Category": category,
                "Position": str(position),
                "Actual": act_val or "",
                "Predicted": pred_val or "",
                "Points": str(points),
                "Team": team,
                "Details": ""
            })

        actual_drivers_top10 = [actual.get(f"d{i}_driver") for i in range(1, 11)]
        
        # 1. DRIVERS (22)
        driver_points_map = {1: 250, 2: 180, 3: 150, 4: 120, 5: 100, 6: 80, 7: 60, 8: 40, 9: 20, 10: 10}
        for i in range(1, 23):
            act_d = actual.get(f"d{i}_driver")
            pred_d = pred.get(f"d{i}_driver")
            pts = 0
            if pred_d:
                if i <= 10:
                    if pred_d == act_d:
                        pts = driver_points_map[i]
                    elif pred_d in actual_drivers_top10:
                        pts = 20
                else:
                    if pred_d == act_d:
                        pts = 10
            add_row("RESULT", i, act_d, pred_d, pts)

        # 2. CONSTRUCTORS (11)
        actual_constructors_top5 = [actual.get(f"c{i}_constructor") for i in range(1, 6)]
        constructor_points_map = {1: 250, 2: 180, 3: 150, 4: 120, 5: 100}
        for i in range(1, 12):
            act_c = actual.get(f"c{i}_constructor")
            pred_c = pred.get(f"c{i}_constructor")
            pts = 0
            if pred_c:
                if i <= 5:
                    if pred_c == act_c:
                        pts = constructor_points_map[i]
                    elif pred_c in actual_constructors_top5:
                        pts = 20
                else:
                    if pred_c == act_c:
                        pts = 10
            add_row("CONSTRUCTOR", i, act_c, pred_c, pts)

        # 3. BONUS (3)
        # Using values from FE SEASON_BONUS_MAX = 25+25+25
        bonuses = [
            ("most_poles", 25),
            ("most_fastest_laps", 25),
            ("most_first_retirements", 25)
        ]
        for key, max_pts in bonuses:
            act_b = actual.get(key)
            pred_b = pred.get(key)
            pts = max_pts if (pred_b and pred_b == act_b) else 0
            # Map key to standard format expected by FE
            label = key.replace("most_", "").replace("_", " ").title()
            add_row("BONUS", label, act_b, pred_b, pts)

        # 4. LEADERBOARD
        # Fetch leaderboard for the whole season
        lb_res = (
            supabase.table("leaderboard")
            .select("total_points, rank, users(username)")
            .eq("season", year)
            .order("total_points", desc=True)
            .limit(10)
            .execute()
        )
        
        if lb_res.data:
            for entry in lb_res.data:
                username = entry.get('users', {}).get('username', 'Unknown')
                pts = entry.get('total_points', 0)
                rank = entry.get('rank', 0)
                add_row("LEADERBOARD", rank, "", "", pts, team=username)

        return jsonify({"success": True, "results": output_rows, "season": year}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500
