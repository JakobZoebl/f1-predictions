"""
PUT /api/auth/update-password

Change password for the authenticated user.

Headers:
    Authorization: Bearer <access_token>

Request body:
    { "new_password": "new_password_123" }

Response:
    { "success": true }

Error responses:
    400 - Password too short (min 8 chars)
    401 - Invalid or expired token
    500 - Server error
"""

import os
import sys

# Add the parent directory to sys.path to allow imports from api._utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Flask, request, jsonify, g
from api._utils.supabase_client import get_supabase_client
from api._utils.auth_helpers import require_auth

app = Flask(__name__)


@app.route('/api/auth/update-password', methods=['PUT'])
@require_auth
def update_password():
    """
    Update user password using their current session.

    Steps:
        1. Verify user is authenticated (handled by @require_auth)
        2. Validate new password (min 8 chars)
        3. Call supabase.auth.admin.update_user_by_id(password=...)
        4. Return success
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Request body is required."}), 400

        new_password = data.get("new_password", "")

        if not new_password or len(new_password) < 8:
            return jsonify({
                "success": False,
                "error": "Password must be at least 8 characters."
            }), 400

        user = g.current_user
        supabase = get_supabase_client()

        # Use admin API to update user password
        supabase.auth.admin.update_user_by_id(
            user["id"],
            {"password": new_password}
        )

        return jsonify({"success": True}), 200

    except Exception as e:
        return jsonify({"success": False, "error": f"Server error: {str(e)}"}), 500
