import os
import sys

# Add the parent directory to sys.path to allow imports from api._utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Blueprint, request, jsonify
from api._utils.supabase_client import get_supabase_client

leaderboard_bp = Blueprint('leaderboard', __name__)

@leaderboard_bp.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    """
    Fetch leaderboard standings from materialized view.
    """
    # TODO: Implement leaderboard query
    pass

@leaderboard_bp.route('/api/leaderboard/chart-data', methods=['GET'])
def get_chart_data():
    """
    Fetch cumulative points progression for all users across races.
    """
    # TODO: Implement chart data aggregation
    pass
