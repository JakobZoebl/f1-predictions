"""
POST /api/auth/reset-password

Request a password reset email via Supabase Auth.

Request body:
    { "email": "user@example.com" }

Response:
    { "success": true, "message": "Password reset email sent" }

Error responses:
    400 - Invalid email format
    500 - Server error
"""

import os
import sys

# Add the parent directory to sys.path to allow imports from api._utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    """
    Send password reset email.
    
    Steps:
        1. Validate email format
        2. Call supabase.auth.reset_password_for_email()
        3. Return success (always, to prevent email enumeration)
    """
    # TODO: Implement password reset logic
    pass
