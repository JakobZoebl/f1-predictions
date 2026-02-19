"""
PUT /api/auth/update-password

Set a new password after clicking the reset link.

Headers:
    Authorization: Bearer <access_token>

Request body:
    { "password": "new_password_123" }

Response:
    { "success": true }

Error responses:
    400 - Password too short (min 8 chars)
    401 - Invalid or expired token
    500 - Server error
"""

from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/api/auth/update-password', methods=['PUT'])
def update_password():
    """
    Update user password using their current session.
    
    Steps:
        1. Verify user is authenticated
        2. Validate new password (min 8 chars)
        3. Call supabase.auth.update_user(password=...)
        4. Return success
    """
    # TODO: Implement password update logic
    pass
