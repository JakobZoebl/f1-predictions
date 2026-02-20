"""
GET /api/results/sprint?race_id=X

Fetch sprint results for a specific race.

Query params:
    - race_id: int (required)

Response:
    {
        "result": {
            "id": 1,
            "race_id": 1,
            "sp1_driver": "...",
            ... (sp2 through sp8),
            "pole_position": "...",
            "fastest_lap": "...",
            "first_retirement": "...",
            "safety_car": false,
            "red_flag": false,
            "created_at": "..."
        } | null
    }

Error responses:
    400 - Missing race_id
    404 - Race not found or has no sprint
    500 - Server error
"""

import os
import sys

# Add the parent directory to sys.path to allow imports from api._utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Flask, request, jsonify
from api._utils.supabase_client import get_supabase_client

app = Flask(__name__)


@app.route('/api/results/sprint', methods=['GET'])
def get_sprint_results():
    """
    Fetch sprint results for a given race_id.
    
    Steps:
        1. Parse race_id from query params
        2. Verify race has_sprint == true
        3. Query sprint_results table
        4. Return result or null
    """
    # TODO: Implement sprint results fetch
    pass
