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

from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """
    Handle user logout.
    
    Steps:
        1. Extract access token from Authorization header
        2. Call supabase.auth.sign_out() / admin.sign_out()
        3. Return success
    """
    # TODO: Implement logout logic
    pass
