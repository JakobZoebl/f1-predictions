"""
GET /api/leaderboard

Fetch leaderboard standings.

Query params (all optional):
    - season: int (default: current year)
    - limit: int (default: all users)

Response:
    {
        "leaderboard": [
            {
                "user_id": "uuid",
                "username": "driver_fan",
                "display_name": "Max Fan",
                "total_points": 1234,
                "rank": 1,
                "avg_points_per_race": 154.25,
                "races_predicted": 8,
                "rank_change": 2
            }
        ]
    }
"""

import os
import sys

# Add the parent directory to sys.path to allow imports from api._utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Flask, request, jsonify
from api._utils.supabase_client import get_supabase_client

app = Flask(__name__)


@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    """
    Fetch leaderboard standings from materialized view.
    
    Steps:
        1. Parse optional season and limit query params
        2. Query the leaderboard materialized view
        3. Calculate rank_change compared to previous race
        4. Return sorted by total_points desc
    """
    # TODO: Implement leaderboard query
    pass
