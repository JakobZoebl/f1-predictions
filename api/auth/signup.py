"""
POST /api/auth/signup

Register a new user with Supabase Auth and create their profile.
Sets default favorite team to Red Bull and driver to Max Verstappen.

Request body:
    {
        "email": "user@example.com",
        "username": "driver_fan",
        "display_name": "Max Fan",
        "password": "password123"
    }

Response:
    {
        "success": true,
        "user": { "id": "uuid", "email": "..." }
    }

Error responses:
    400 - Validation error (invalid email, username taken, etc.)
    409 - Email or username already exists
    500 - Server error
"""

import os
import sys

# Add the parent directory to sys.path to allow imports from api._utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Flask, request, jsonify
from api._utils.supabase_client import get_supabase_client
from api._utils.validators import validate_signup

app = Flask(__name__)


@app.route('/api/auth/signup', methods=['POST'])
def signup():
    """
    Handle user registration.
    
    Steps:
        1. Validate input (email, username format, password length)
        2. Check username uniqueness in users table
        3. Call supabase.auth.sign_up()
        4. Create user profile in users table with default preferences
        5. Return success with user info
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Request body is required."}), 400

        # 1. Validate input
        is_valid, error_msg = validate_signup(data)
        if not is_valid:
            return jsonify({"success": False, "error": error_msg}), 400

        email = data["email"].strip()
        username = data["username"].strip()
        display_name = data["display_name"].strip()
        password = data["password"]

        supabase = get_supabase_client()

        # 2. Check username uniqueness
        existing = (
            supabase.table("users")
            .select("id")
            .eq("username", username)
            .execute()
        )
        if existing.data:
            return jsonify({"success": False, "error": "Username is already taken."}), 409

        # 3. Create auth user via Supabase Auth
        auth_response = supabase.auth.admin.create_user({
            "email": email,
            "password": password,
            "email_confirm": True,  # Auto-confirm for friend group
            "user_metadata": {
                "username": username,
                "display_name": display_name,
            },
        })

        if not auth_response.user:
            return jsonify({"success": False, "error": "Failed to create user account."}), 500

        user_id = auth_response.user.id

        # 4. Create user profile in users table
        # Default: Red Bull (redbull) and Max Verstappen (verstappen)
        profile_result = (
            supabase.table("users")
            .insert({
                "id": user_id,
                "username": username,
                "display_name": display_name,
                "favorite_team_id": "redbull",
                "favorite_driver_id": "verstappen",
            })
            .execute()
        )

        if not profile_result.data:
            # Rollback: delete the auth user if profile creation fails
            supabase.auth.admin.delete_user(user_id)
            return jsonify({"success": False, "error": "Failed to create user profile."}), 500

        # 5. Return success
        return jsonify({
            "success": True,
            "user": {
                "id": user_id,
                "email": email,
                "username": username,
                "display_name": display_name,
            },
        }), 201

    except Exception as e:
        return jsonify({"success": False, "error": f"Server error: {str(e)}"}), 500
