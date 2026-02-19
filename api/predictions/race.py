"""
/api/predictions/race

GET  /api/predictions/race?race_id=X  — Fetch current user's race prediction
POST /api/predictions/race             — Submit or update a race prediction

Headers:
    Authorization: Bearer <access_token>

POST Request body:
    {
        "race_id": 1,
        "p1_driver": "Max Verstappen",
        "p2_driver": "Lewis Hamilton",
        ... (p3 through p10),
        "c1_constructor": "Red Bull",
        ... (c2 through c5),
        "pole_position": "Max Verstappen",
        "fastest_lap": "Lewis Hamilton",
        "first_retirement": "No retirement",
        "safety_car": true,
        "red_flag": false
    }

GET Response:
    { "prediction": { ... } | null }

POST Response:
    { "success": true, "prediction_id": 42 }

Error responses:
    400 - Validation error (duplicates, missing fields)
    401 - Not authenticated
    403 - Race prediction deadline has passed
    404 - Race not found
    500 - Server error
"""

from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/api/predictions/race', methods=['GET', 'POST'])
def race_prediction():
    """
    Handle race prediction fetch and submission.
    
    GET:
        1. Verify authentication
        2. Get race_id from query params
        3. Fetch user's prediction for that race
        4. Return prediction or null
        
    POST:
        1. Verify authentication
        2. Validate prediction data (no duplicates, all fields present)
        3. Check race exists and deadline hasn't passed
        4. Upsert prediction (insert or update)
        5. Return prediction_id
    """
    # TODO: Implement GET and POST logic
    pass
