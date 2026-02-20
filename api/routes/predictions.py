import os
import sys

# Add the parent directory to sys.path to allow imports from api._utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Blueprint, request, jsonify, g
from api._utils.supabase_client import get_supabase_client
from api._utils.auth_helpers import require_auth

predictions_bp = Blueprint('predictions', __name__)

@predictions_bp.route('/api/predictions', methods=['GET', 'POST'])
def handle_prediction():
    """
    Handle unified prediction fetch and submission.
    Accepts: ?session_type=race|sprint|season (GET)
             { "session_type": "race" | "sprint" | "season", ...prediction_data } (POST)
    """
    # TODO: Implement unified GET and POST logic for all session types
    pass
