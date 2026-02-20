import os
import sys

# Add the parent directory to sys.path to allow imports from api._utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Blueprint, request, jsonify, g
from api._utils.supabase_client import get_supabase_client
from api._utils.auth_helpers import require_auth
from api._utils.validators import validate_profile_update

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/api/profile', methods=['GET', 'PUT'])
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
    """Update the authenticated user's profile (name, preferences, and/or password)."""
    try:
        user = g.current_user
        data = request.get_json()

        if not data:
            return jsonify({"success": False, "error": "Request body is required."}), 400

        # Build update payload for the users table
        update_data = {}
        
        if "display_name" in data:
            update_data["display_name"] = data["display_name"].strip()
            
        if "favorite_team_id" in data:
            val = data["favorite_team_id"]
            if val is not None and not isinstance(val, str):
                return jsonify({"success": False, "error": "favorite_team_id must be a string."}), 400
            update_data["favorite_team_id"] = val
            
        if "favorite_driver_id" in data:
            val = data["favorite_driver_id"]
            if val is not None and not isinstance(val, str):
                return jsonify({"success": False, "error": "favorite_driver_id must be a string."}), 400
            update_data["favorite_driver_id"] = val

        supabase = get_supabase_client()
        updated_profile = {}

        # 1. Handle standard profile fields (display_name, favorites)
        if update_data:
            result = (
                supabase.table("users")
                .update(update_data)
                .eq("id", user["id"])
                .execute()
            )
            if not result.data:
                return jsonify({"success": False, "error": "Failed to update profile data."}), 500
            updated_profile = result.data[0]

        # 2. Handle password updates simultaneously if provided
        new_password = data.get("password", "")
        if new_password:
            if len(new_password) < 8:
                return jsonify({
                    "success": False,
                    "error": "Password must be at least 8 characters."
                }), 400
                
            supabase.auth.admin.update_user_by_id(
                user["id"],
                {"password": new_password}
            )

        if not update_data and not new_password:
             return jsonify({"success": False, "error": "No valid fields to update."}), 400

        return jsonify({"success": True, "profile": updated_profile}), 200

    except Exception as e:
        return jsonify({"success": False, "error": f"Server error: {str(e)}"}), 500
