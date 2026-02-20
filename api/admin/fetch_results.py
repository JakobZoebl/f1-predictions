"""
POST /api/admin/fetch-results

Fetch race results from the Jolpica F1 API and save to database (admin only).

Headers:
    Authorization: Bearer <access_token>

Request body:
    { "race_id": 1 }

Response:
    { "success": true, "source": "api" }

Process:
    1. Get race season and round from database
    2. Call Jolpica API for race results and qualifying
    3. Parse response into our schema
    4. Save to race_results table
    5. Trigger points calculation

Error responses:
    401 - Not authenticated
    403 - Not admin
    404 - Race not found
    502 - External API unavailable
    500 - Server error
"""

import os
import sys

# Add the parent directory to sys.path to allow imports from api._utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Flask, request, jsonify
from api._utils.supabase_client import get_supabase_client
from api._utils.auth_helpers import require_admin
from api._utils.f1_api import fetch_race_results

app = Flask(__name__)


@app.route('/api/admin/fetch-results', methods=['POST'])
def admin_fetch_results():
    """
    Fetch results from Jolpica API and store.
    
    Steps:
        1. Verify admin role
        2. Look up race season/round from database
        3. Use f1_api.fetch_race_results()
        4. Use f1_api.fetch_qualifying_results() for pole
        5. Save to race_results table
        6. Trigger calculate_points
    """
    # TODO: Implement API fetch and store
    pass
