"""
/api/profile/preferences

GET  /api/profile/preferences  — Fetch own preferences
PUT  /api/profile/preferences  — Update own preferences

Headers:
    Authorization: Bearer <access_token>

GET Response:
    {
        "preferences": {
            "favorite_team_id": "red_bull",
            "favorite_driver_id": "max_verstappen"
        }
    }

PUT Request body:
    {
        "favorite_team_id": "ferrari",
        "favorite_driver_id": "charles_leclerc"
    }

Error responses:
    401 - Not authenticated
    400 - Invalid team or driver ID
    500 - Server error
"""

from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/api/profile/preferences', methods=['GET', 'PUT'])
def preferences():
    """
    Handle user preferences (favorite team/driver).
    
    GET:
        1. Verify authentication
        2. Fetch favorite_team_id and favorite_driver_id from users table
        
    PUT:
        1. Verify authentication
        2. Validate team/driver IDs
        3. Update users table
    """
    # TODO: Implement preferences logic
    pass
