"""
/api/predictions/season

GET  /api/predictions/season?season=2026  — Fetch current user's season prediction
POST /api/predictions/season               — Submit season-long predictions

Headers:
    Authorization: Bearer <access_token>

POST Request body:
    {
        "season": 2026,
        "d1_driver": "Max Verstappen",
        ... (d2 through d20),
        "c1_constructor": "Red Bull",
        ... (c2 through c11),
        "most_poles": "Max Verstappen",
        "most_fastest_laps": "Lewis Hamilton"
    }

Error responses:
    400 - Validation error (duplicates, missing fields)
    401 - Not authenticated
    403 - Season predictions are locked (Round 1 has started)
    500 - Server error
"""

from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/api/predictions/season', methods=['GET', 'POST'])
def season_prediction():
    """
    Handle season prediction fetch and submission.
    
    GET:
        1. Verify authentication
        2. Get season from query params (default: current year)
        3. Fetch user's season prediction
        
    POST:
        1. Verify authentication
        2. Validate all 20 drivers, 11 constructors, no duplicates
        3. Check Round 1 hasn't started yet
        4. Upsert season prediction
        5. Set locked=true once Round 1 starts
    """
    # TODO: Implement GET and POST logic
    pass
