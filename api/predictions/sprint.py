"""
/api/predictions/sprint

GET  /api/predictions/sprint?race_id=X  — Fetch current user's sprint prediction
POST /api/predictions/sprint             — Submit or update a sprint prediction

Headers:
    Authorization: Bearer <access_token>

POST Request body:
    {
        "race_id": 1,
        "sp1_driver": "Max Verstappen",
        ... (sp2 through sp8),
        "pole_position": "...",
        "fastest_lap": "...",
        "first_retirement": "...",
        "safety_car": true,
        "red_flag": false
    }

Error responses:
    400 - Validation error
    401 - Not authenticated
    403 - Sprint prediction deadline has passed / Race has no sprint
    404 - Race not found
    500 - Server error
"""

import os
import sys

# Add the parent directory to sys.path to allow imports from api._utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Flask, request, jsonify, g
from api._utils.supabase_client import get_supabase_client
from api._utils.auth_helpers import require_auth

app = Flask(__name__)


@app.route('/api/predictions/sprint', methods=['GET', 'POST'])
def sprint_prediction():
    """
    Handle sprint prediction fetch and submission.
    
    GET:
        1. Verify authentication
        2. Get race_id from query params
        3. Check race has_sprint == true
        4. Fetch user's sprint prediction
        
    POST:
        1. Verify authentication
        2. Validate sprint prediction data
        3. Check race has sprint and deadline hasn't passed
        4. Upsert sprint prediction
    """
    # TODO: Implement GET and POST logic
    pass
