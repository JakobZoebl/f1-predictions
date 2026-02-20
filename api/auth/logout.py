"""
POST /api/auth/logout

Sign out the current user and invalidate their session.

Headers:
    Authorization: Bearer <access_token>

Response:
    { "success": true }

Error responses:
    401 - Not authenticated
    500 - Server error
"""

import os
import sys

# Add the parent directory to sys.path to allow imports from api._utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Flask, request, jsonify
from api._utils.supabase_client import get_supabase_client
from api._utils.auth_helpers import get_current_user

app = Flask(__name__)


@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """
    Handle user logout.
    
    Steps:
        1. Extract access token from Authorization header
        2. Verify the user is authenticated
        3. Call supabase.auth.admin.sign_out() to invalidate the session
        4. Return success
    """
    try:
        # Verify the user is authenticated
        try:
            user = get_current_user(request)
        except ValueError as e:
            return jsonify({"success": False, "error": str(e)}), 401

        supabase = get_supabase_client()

        # Sign out the user using admin API (invalidates all sessions)
        supabase.auth.admin.sign_out(user["id"])

        return jsonify({"success": True}), 200

    except Exception as e:
        return jsonify({"success": False, "error": f"Server error: {str(e)}"}), 500
