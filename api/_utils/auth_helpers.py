"""
Authentication helper functions.

Provides JWT verification, current user extraction, and admin role
checking for protected API endpoints.

Environment variables required:
  - SUPABASE_JWT_SECRET
"""


def verify_jwt(token: str) -> dict:
    """
    Verify and decode a Supabase JWT access token.
    
    Args:
        token: The Bearer token from the Authorization header.
        
    Returns:
        dict: Decoded JWT payload containing user info.
        
    Raises:
        ValueError: If token is invalid or expired.
    """
    # TODO: Decode and verify JWT using PyJWT
    # TODO: Check expiration, issuer, etc.
    pass


def get_current_user(request) -> dict:
    """
    Extract the current authenticated user from a Flask request.
    
    Args:
        request: Flask request object with Authorization header.
        
    Returns:
        dict: User info dict with at minimum 'id' (UUID).
        
    Raises:
        ValueError: If no valid auth token is present.
    """
    # TODO: Extract Bearer token from request headers
    # TODO: Call verify_jwt and return user payload
    pass


def require_auth(f):
    """
    Decorator to protect endpoints — returns 401 if not authenticated.
    
    Usage:
        @require_auth
        def my_endpoint():
            ...
    """
    # TODO: Implement as a Flask/function decorator
    # TODO: Call get_current_user, return 401 JSON on failure
    pass


def require_admin(f):
    """
    Decorator to protect admin-only endpoints — returns 403 if not admin.
    
    Usage:
        @require_admin
        def admin_endpoint():
            ...
    """
    # TODO: Check user role from Supabase users table
    # TODO: Return 403 if role != 'admin'
    pass
