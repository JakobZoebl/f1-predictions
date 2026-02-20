"""
POST /api/auth/login

Authenticate a user with email and password using Supabase Auth.

Request body:
    {
        "email": "user@example.com",
        "password": "password123"
    }

Response:
    {
        "success": true,
        "session": { ... },
        "user": { "id": "uuid", "email": "..." }
    }
    
Error responses:
    400 - Missing fields
    401 - Invalid credentials
    500 - Server error
"""

import os
import sys

# Add the parent directory to sys.path to allow imports from api._utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Flask, request, jsonify
from api._utils.supabase_client import get_supabase_client

app = Flask(__name__)


@app.route('/api/auth/login', methods=['POST'])
def login():
    """
    Handle email/password login via Supabase Auth.
    
    Steps:
        1. Validate request body (email, password)
        2. Call supabase.auth.sign_in_with_password()
        3. Return session tokens on success
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Request body is required."}), 400

        email = data.get("email", "").strip()
        password = data.get("password", "")

        if not email:
            return jsonify({"success": False, "error": "Email is required."}), 400
        if not password:
            return jsonify({"success": False, "error": "Password is required."}), 400

        supabase = get_supabase_client()

        # Authenticate via Supabase Auth
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password,
        })

        if not auth_response.session:
            return jsonify({"success": False, "error": "Invalid credentials."}), 401

        session = auth_response.session
        user = auth_response.user

        return jsonify({
            "success": True,
            "session": {
                "access_token": session.access_token,
                "refresh_token": session.refresh_token,
                "expires_in": session.expires_in,
                "token_type": "bearer",
            },
            "user": {
                "id": user.id,
                "email": user.email,
            },
        }), 200

    except Exception as e:
        error_msg = str(e)
        # Supabase returns specific error messages for invalid credentials
        if "Invalid login credentials" in error_msg:
            return jsonify({"success": False, "error": "Email or password is incorrect."}), 401
        return jsonify({"success": False, "error": f"Server error: {error_msg}"}), 500
