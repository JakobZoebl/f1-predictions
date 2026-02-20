import os
import sys

# Add the parent directory to sys.path to allow imports from api._utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Blueprint, request, jsonify
from api._utils.supabase_client import get_supabase_client
from api._utils.auth_helpers import require_admin
from api._utils.scoring import calculate_season_points
from api._utils.f1_api import fetch_race_results

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/api/admin/calculate-points', methods=['POST'])
def calculate_points():
    """
    Calculate points for all predictions for a race.
    """
    # TODO: Implement points calculation trigger
    pass


@admin_bp.route('/api/admin/fetch-results', methods=['POST'])
def admin_fetch_results():
    """
    Fetch results from Jolpica API and store.
    """
    # TODO: Implement API fetch and store
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
    Enter race results manually.
    """
    # TODO: Implement manual results entry
    pass


@admin_bp.route('/api/admin/sprint-results', methods=['POST'])
def admin_sprint_results():
    """
    Enter sprint results manually.
    """
    # TODO: Implement manual sprint results entry
    pass
