"""
POST /api/admin/calculate-points

Calculate and store points for all predictions for a given race (admin only).

Headers:
    Authorization: Bearer <access_token>

Request body:
    { "race_id": 1, "session_type": "race" | "sprint" }

Response:
    {
        "success": true,
        "predictions_updated": 12
    }

Process:
    1. Fetch race/sprint results from database
    2. Fetch all predictions for that race
    3. For each prediction, calculate points using scoring rules
    4. Update prediction.points
    5. Create/update entries in points_log
    6. Refresh leaderboard materialized view

Error responses:
    400 - No results found for this race
    401 - Not authenticated
    403 - Not admin
    404 - Race not found
    500 - Server error
"""

from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/api/admin/calculate-points', methods=['POST'])
def calculate_points():
    """
    Calculate points for all predictions for a race.
    
    Steps:
        1. Verify admin role
        2. Fetch results for the race
        3. Fetch all user predictions for the race
        4. For each prediction, use scoring.calculate_race_points()
        5. Update prediction.points and create points_log entries
        6. Refresh leaderboard materialized view
    """
    # TODO: Implement points calculation trigger
    pass
