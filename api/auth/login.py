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
    401 - Invalid credentials
    429 - Too many login attempts
    500 - Server error
"""

from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/api/auth/login', methods=['POST'])
def login():
    """
    Handle email/password login via Supabase Auth.
    
    Steps:
        1. Validate request body (email, password)
        2. Check rate limiting (5 attempts/hour per email)
        3. Call supabase.auth.sign_in_with_password()
        4. Return session tokens on success
    """
    # TODO: Implement login logic
    pass
