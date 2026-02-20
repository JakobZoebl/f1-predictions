"""
POST /api/admin/results

Manually enter race results (admin only).

Headers:
    Authorization: Bearer <access_token>

Request body:
    {
        "race_id": 1,
        "p1_driver": "Max Verstappen",
        ... (p2 through p10),
        "c1_constructor": "Red Bull",
        ... (c2 through c5),
        "pole_position": "Max Verstappen",
        "fastest_lap": "Lewis Hamilton",
        "first_retirement": "No retirement",
        "safety_car": true,
        "red_flag": false
    }

Response:
    { "success": true, "result_id": 1 }

After saving, automatically triggers points calculation.

Error responses:
    400 - Validation error
    401 - Not authenticated
    403 - Not admin
    409 - Results already exist for this race
    500 - Server error
"""

import os
import sys

# Add the parent directory to sys.path to allow imports from api._utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Flask, request, jsonify
from api._utils.supabase_client import get_supabase_client
from api._utils.auth_helpers import require_admin

app = Flask(__name__)


@app.route('/api/admin/results', methods=['POST'])
def admin_results():
    """
    Enter race results manually.
    
    Steps:
        1. Verify admin role
        2. Validate results data
        3. Check no existing results for this race
        4. Insert into race_results table
        5. Update race status to 'completed'
        6. Trigger points calculation
    """
    # TODO: Implement manual results entry
    pass
