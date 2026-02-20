import os
import sys

# Add the parent directory to sys.path to allow imports from api._utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Blueprint, request, jsonify
from api._utils.supabase_client import get_supabase_client

results_bp = Blueprint('results', __name__)

@results_bp.route('/api/results/race', methods=['GET'])
def get_race_results():
    """
    Fetch race results for a given race_id.
    """
    # TODO: Implement race results fetch
    pass

@results_bp.route('/api/results/sprint', methods=['GET'])
def get_sprint_results():
    """
    Fetch sprint results for a given race_id.
    """
    # TODO: Implement sprint results fetch
    pass
