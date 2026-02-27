"""
Authentication helper functions.

Provides JWT verification, current user extraction, and admin role
checking for protected API endpoints.

Environment variables required:
  - SUPABASE_JWT_SECRET
"""

import os
from functools import wraps


from flask import request, jsonify, g

from api._utils.supabase_client import get_supabase_client



def get_current_user(req) -> dict:
    """
    Extract and verify the current authenticated user from a Flask request.
    
    Verifies the token by calling the Supabase Auth API's getUser endpoint.
    This ensures the token is valid, not expired, and not revoked (if using RLS).
    
    Args:
        req: Flask request object with Authorization header.
        
    Returns:
        dict: User info dict with 'id', 'email', 'role', etc.
        
    Raises:
        ValueError: If no valid auth token is present or verification fails.
    """
    auth_header = req.headers.get("Authorization", "")

    if not auth_header.startswith("Bearer "):
        raise ValueError("Missing or malformed Authorization header.")

    token = auth_header[7:]  # Strip "Bearer "
    
    try:
        # Create a temporary client or use the library's verification method
        # Using get_supabase_client() which uses the service role key is okay 
        # for admin tasks, but for verification we strictly want to check the *token*.
        # The supabase-py client allows checking a token directly.
        
        supabase = get_supabase_client()
        
        # Verify user by calling the Auth server
        # This checks signature, expiration, and revocation
        response = supabase.auth.get_user(token)
        
        if not response.user:
             raise ValueError("Invalid or expired token.")
             
        user = response.user
        
        # Map Supabase User object to a simple dict for the app
        return {
            "id": user.id,
            "email": user.email,
            "role": user.role or "authenticated",
            "app_metadata": user.app_metadata,
            "user_metadata": user.user_metadata
        }
        
    except Exception as e:
        raise ValueError(f"Token verification failed: {str(e)}")



def require_auth(f):
    """
    Decorator to protect endpoints — returns 401 if not authenticated.
    
    Sets `g.current_user` on the Flask request context so the endpoint
    handler can access the authenticated user.
    
    Usage:
        @require_auth
        def my_endpoint():
            user = g.current_user
            ...
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            g.current_user = get_current_user(request)
        except ValueError as e:
            return jsonify({"success": False, "error": str(e)}), 401
        return f(*args, **kwargs)
    return decorated

