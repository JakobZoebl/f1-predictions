import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Blueprint, jsonify
from api._utils.supabase_client import get_supabase_client

leaderboard_bp = Blueprint('leaderboard', __name__)

@leaderboard_bp.route('/api/leaderboard/stats', methods=['GET'])
def get_season_stats():
    try:
        supabase = get_supabase_client()

        # 1. Avg Points/Race (across all players)
        # We can calculate this from the leaderboard table or points_log
        lb_res = supabase.table("leaderboard").select("avg_points_per_race").execute()
        avg_points = 0
        if lb_res.data:
            total_avg = sum(item['avg_points_per_race'] for item in lb_res.data)
            avg_points = round(total_avg / len(lb_res.data), 1) if len(lb_res.data) > 0 else 0

        # 2. Highest Score (single race)
        highest_res = (
            supabase.table("points_log")
            .select("total_points, user_id, race_id, users(username), races(round)")
            .order("total_points", desc=True)
            .limit(1)
            .execute()
        )
        
        highest_score = {"value": 0, "subtext": "N/A"}
        if highest_res.data:
            item = highest_res.data[0]
            username = item.get('users', {}).get('username', 'Unknown')
            round_num = item.get('races', {}).get('round', '?')
            highest_score = {
                "value": item['total_points'],
                "subtext": f"{username} (R{round_num})"
            }

        # 3. Active Players (Total entries in leaderboard)
        active_players_res = supabase.table("leaderboard").select("user_id", count="exact").execute()
        active_players = active_players_res.count if active_players_res.count else 0

        # 4. Total Predictions (Total items in points_log)
        total_predictions_res = supabase.table("points_log").select("id", count="exact").execute()
        total_predictions = total_predictions_res.count if total_predictions_res.count else 0

        return jsonify({
            "success": True,
            "stats": {
                "avgPoints": avg_points,
                "highestScore": highest_score,
                "activePlayers": active_players,
                "totalPredictions": total_predictions
            }
        }), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500
