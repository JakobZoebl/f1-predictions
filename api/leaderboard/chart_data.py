"""
GET /api/leaderboard/chart-data

Fetch points progression data for the leaderboard chart.

Query params (optional):
    - season: int (default: current year)

Response:
    {
        "races": [
            { "round": 1, "name": "Bahrain GP" },
            { "round": 2, "name": "Saudi Arabian GP" }
        ],
        "users": [
            {
                "user_id": "uuid",
                "username": "driver_fan",
                "points_by_race": [
                    { "round": 1, "points": 87, "cumulative": 87 },
                    { "round": 2, "points": 124, "cumulative": 211 }
                ]
            }
        ]
    }
"""

from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/api/leaderboard/chart-data', methods=['GET'])
def get_chart_data():
    """
    Fetch cumulative points progression for all users across races.
    
    Steps:
        1. Parse season from query params
        2. Fetch all completed races for the season
        3. For each user, fetch points per race from points_log
        4. Calculate cumulative totals
        5. Return structured data for D3/Recharts visualization
    """
    # TODO: Implement chart data aggregation
    pass
