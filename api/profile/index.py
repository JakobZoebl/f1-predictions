"""
/api/profile

GET  /api/profile?user_id=X  — Fetch user profile and stats
PUT  /api/profile              — Update own profile (authenticated)

GET Response:
    {
        "user": {
            "username": "driver_fan",
            "display_name": "Max Fan",
            "favorite_team_id": "red_bull",
            "favorite_driver_id": "max_verstappen"
        },
        "stats": {
            "total_points": 1234,
            "rank": 3,
            "avg_points_per_race": 154.25,
            "best_race": { "name": "Monaco GP", "points": 210 },
            "worst_race": { "name": "Bahrain GP", "points": 45 },
            "accuracy": {
                "top_10_correct": 52,
                "total_predictions": 80,
                "percentage": 65.0
            },
            "points_breakdown": {
                "driver_positions": 800,
                "constructors": 250,
                "pole_position": 60,
                "fastest_lap": 70,
                "other_bonuses": 54
            }
        }
    }

PUT Request body:
    {
        "display_name": "New Name",
        "favorite_team_id": "ferrari",
        "favorite_driver_id": "charles_leclerc"
    }

Error responses:
    400 - Validation error
    401 - Not authenticated (PUT only)
    404 - User not found
    500 - Server error
"""

from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/api/profile', methods=['GET', 'PUT'])
def profile():
    """
    Handle profile fetch (public) and update (authenticated).
    
    GET:
        1. Parse user_id from query params
        2. Fetch user profile from users table
        3. Aggregate stats from predictions, points_log, leaderboard
        4. Calculate accuracy and breakdown
        
    PUT:
        1. Verify authentication
        2. Validate update data
        3. Update only allowed fields in users table
        4. Return success
    """
    # TODO: Implement GET and PUT logic
    pass
