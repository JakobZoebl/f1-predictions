"""
GET /api/results/race?race_id=X

Fetch race results for a specific race.

Query params:
    - race_id: int (required)

Response:
    {
        "result": {
            "id": 1,
            "race_id": 1,
            "p1_driver": "Max Verstappen",
            ... (p2 through p10),
            "c1_constructor": "Red Bull",
            ... (c2 through c5),
            "pole_position": "...",
            "fastest_lap": "...",
            "first_retirement": "...",
            "safety_car": true,
            "red_flag": false,
            "created_at": "..."
        } | null
    }

Error responses:
    400 - Missing race_id
    404 - Race not found
    500 - Server error
"""

import os
import sys

# Add the parent directory to sys.path to allow imports from api._utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Flask, request, jsonify
from api._utils.supabase_client import get_supabase_client

app = Flask(__name__)


@app.route('/api/results/race', methods=['GET'])
def get_race_results():
    """
    Fetch race results for a given race_id.
    
    Steps:
        1. Parse race_id from query params
        2. Query race_results table
        3. Return result or null if not yet available
    """
    # TODO: Implement race results fetch
    pass
