import os
import sys

# Add the parent directory to sys.path to allow imports from api._utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Blueprint, request, jsonify
from api._utils.supabase_client import get_supabase_client
from api._utils.auth_helpers import require_admin
from api._utils.f1_api import fetch_race_results

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/api/admin/fetch-results', methods=['POST'])
def admin_fetch_results():
    """
    Fetch results (race or sprint) from Jolpica API and store.
    Accepts: { "race_id": 1, "session_type": "race" | "sprint" }
    """
    # TODO: Implement unified API fetch and store
    pass

@admin_bp.route('/api/admin/races', methods=['POST', 'PUT', 'DELETE'])
def admin_races():
    """
    Manage races (admin only).
    """
    # TODO: Implement admin race management
    pass

@admin_bp.route('/api/admin/results', methods=['POST'])
def admin_results():
    """
    Enter results manually.
    Accepts: { "race_id": 1, "session_type": "race" | "sprint", ...results }
    """
    # TODO: Implement unified manual results entry
    pass
