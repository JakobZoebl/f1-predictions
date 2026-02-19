"""
GET /api

Health check endpoint for the F1 Predictions API.

Response:
    { "status": "healthy", "service": "f1-predictions-api" }
"""

from flask import Flask, jsonify

app = Flask(__name__)


@app.route('/api', methods=['GET'])
def health_check():
    """
    Simple health check endpoint.
    Returns API status for monitoring and deployment verification.
    """
    return jsonify({
        "status": "healthy",
        "service": "f1-predictions-api"
    })
