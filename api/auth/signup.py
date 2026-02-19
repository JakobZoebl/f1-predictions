"""
POST /api/auth/signup

Register a new user with Supabase Auth and create their profile.

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

from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/api/auth/signup', methods=['POST'])
def signup():
    """
    Handle user registration.
    
    Steps:
        1. Validate input (email, username format, password length)
        2. Check username uniqueness in users table
        3. Call supabase.auth.sign_up()
        4. Create user profile in users table
        5. Return success with user info
    """
    # TODO: Implement signup logic
    pass
