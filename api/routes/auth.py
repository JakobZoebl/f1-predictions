import os
import sys

# Add the parent directory to sys.path to allow imports from api._utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Blueprint, request, jsonify, g
from api._utils.supabase_client import get_supabase_client
from api._utils.validators import validate_signup
from api._utils.auth_helpers import get_current_user, require_auth

# Create a Blueprint for authentication routes
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    """
    Handle email/password login via Supabase Auth.
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
        if "Invalid login credentials" in error_msg:
            return jsonify({"success": False, "error": "Email or password is incorrect."}), 401
        return jsonify({"success": False, "error": f"Server error: {error_msg}"}), 500


@auth_bp.route('/api/auth/signup', methods=['POST'])
def signup():
    """
    Handle user registration.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Request body is required."}), 400

        is_valid, error_msg = validate_signup(data)
        if not is_valid:
            return jsonify({"success": False, "error": error_msg}), 400

        email = data["email"].strip()
        username = data["username"].strip()
        display_name = data["display_name"].strip()
        password = data["password"]
        favorite_team_id = data.get("favorite_team_id", "redbull")
        favorite_driver_id = data.get("favorite_driver_id", "verstappen")

        supabase = get_supabase_client()

        # Check for existing user in our public.users table
        existing = (
            supabase.table("users")
            .select("id")
            .eq("username", username)
            .execute()
        )
        if existing.data:
            return jsonify({"success": False, "error": "Username is already taken."}), 409

        # Register user with Supabase Auth using Admin API
        try:
            auth_response = supabase.auth.admin.create_user({
                "email": email,
                "password": password,
                "email_confirm": True,
                "user_metadata": {
                    "username": username,
                    "display_name": display_name,
                    "favorite_team_id": favorite_team_id,
                    "favorite_driver_id": favorite_driver_id,
                },
            })
        except Exception as auth_err:
            print(f"DEBUG: Supabase Auth error: {str(auth_err)}")
            return jsonify({"success": False, "error": f"Auth error: {str(auth_err)}"}), 500

        if not auth_response or not hasattr(auth_response, 'user') or not auth_response.user:
            print(f"DEBUG: Auth response details: {auth_response}")
            return jsonify({"success": False, "error": "Failed to create user account."}), 500

        user_id = auth_response.user.id

        profile_result = (
            supabase.table("users")
            .select("*")
            .eq("id", user_id)
            .single()
            .execute()
        )

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
        print(f"DEBUG: Unexpected signup error: {str(e)}")
        return jsonify({"success": False, "error": f"Server error: {str(e)}"}), 500


@auth_bp.route('/api/auth/delete-account', methods=['DELETE'])
@require_auth
def delete_account():
    """
    Handle user account deletion.
    """
    try:
        user = g.current_user
        supabase = get_supabase_client()
        
        # Delete user from Supabase Auth using Admin API
        # This will trigger cascading deletes in public.users and other tables
        supabase.auth.admin.delete_user(user["id"])

        return jsonify({"success": True, "message": "Account deleted successfully."}), 200

    except Exception as e:
        return jsonify({"success": False, "error": f"Server error: {str(e)}"}), 500


@auth_bp.route('/api/auth/logout', methods=['POST'])
def logout():
    """
    Handle user logout.
    """
    try:
        try:
            user = get_current_user(request)
        except ValueError as e:
            return jsonify({"success": False, "error": str(e)}), 401

        supabase = get_supabase_client()
        supabase.auth.admin.sign_out(user["id"])

        return jsonify({"success": True}), 200

    except Exception as e:
        return jsonify({"success": False, "error": f"Server error: {str(e)}"}), 500


@auth_bp.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    """
    Send password reset email.
    """
    # TODO: Implement password reset logic
    pass



