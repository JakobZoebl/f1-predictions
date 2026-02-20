"""
/api/profile

GET  /api/profile  — Fetch own profile (authenticated)
PUT  /api/profile  — Update own profile (authenticated)

GET Response:
    {
        "success": true,
        "profile": {
            "username": "driver_fan",
            "display_name": "Max Fan",
            "email": "user@example.com",
            "favorite_team_id": "ferrari",
            "favorite_driver_id": "leclerc",
            "created_at": "2026-01-15T12:00:00Z"
        }
    }

PUT Request body:
    { "display_name": "New Name" }

PUT Response:
    { "success": true, "profile": { ... } }

Error responses:
    400 - Validation error
    401 - Not authenticated
    500 - Server error
"""

import os
import sys

# Add the parent directory to sys.path to allow imports from api._utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Flask, request, jsonify, g
from api._utils.supabase_client import get_supabase_client
from api._utils.auth_helpers import require_auth
from api._utils.validators import validate_profile_update

app = Flask(__name__)


@app.route('/api/profile', methods=['GET', 'PUT'])
@require_auth
def profile():
    """Handle profile fetch and update (both authenticated)."""
    if request.method == 'GET':
        return _get_profile()
    else:
        return _update_profile()


def _get_profile():
    #Fetch the authenticated user's profile
    try:
        user = g.current_user
        supabase = get_supabase_client()

        result = (
            supabase.table("users")
            .select("username, display_name, favorite_team_id, favorite_driver_id, created_at")
            .eq("id", user["id"])
            .single()
            .execute()
        )

        if not result.data:
            return jsonify({"success": False, "error": "Profile not found."}), 404

        profile_data = result.data
        profile_data["email"] = user["email"]

        return jsonify({"success": True, "profile": profile_data}), 200

    except Exception as e:
        return jsonify({"success": False, "error": f"Server error: {str(e)}"}), 500


def _update_profile():
    """Update the authenticated user's display name."""
    try:
        user = g.current_user
        data = request.get_json()

        if not data:
            return jsonify({"success": False, "error": "Request body is required."}), 400

        # Validate input
        is_valid, error_msg = validate_profile_update(data)
        if not is_valid:
            return jsonify({"success": False, "error": error_msg}), 400

        # Build update payload — only allow display_name
        update_data = {}
        if "display_name" in data:
            update_data["display_name"] = data["display_name"].strip()

        if not update_data:
            return jsonify({"success": False, "error": "No valid fields to update."}), 400

        supabase = get_supabase_client()

        result = (
            supabase.table("users")
            .update(update_data)
            .eq("id", user["id"])
            .execute()
        )

        if not result.data:
            return jsonify({"success": False, "error": "Failed to update profile."}), 500

        return jsonify({"success": True, "profile": result.data[0]}), 200

    except Exception as e:
        return jsonify({"success": False, "error": f"Server error: {str(e)}"}), 500
