"""
Main entry point for Vercel Serverless Functions.
This file serves as a single "catch-all" Flask application that routes all incoming
traffic to the appropriate Blueprint, bypassing Vercel's 12-function Hobby plan limit.
"""

from flask import Flask

# Import all blueprints
from api.routes.auth import auth_bp
from api.routes.predictions import predictions_bp
from api.routes.profile import profile_bp
from api.routes.results import results_bp
from api.routes.leaderboard import leaderboard_bp
from api.cron.fetch_results import cron_bp

app = Flask(__name__)

# Register all blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(predictions_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(results_bp)
app.register_blueprint(leaderboard_bp)
app.register_blueprint(cron_bp)

# Health check / Fallback root route
@app.route('/api')
@app.route('/api/index.py')
@app.route('/api/health')
def health_check():
    """Simple health check endpoint."""
    return {"status": "ok", "message": "F1 Predictions API is running via single Vercel Function"}

# Vercel requires the app to be named `app` for it to be recognized as a WSGI application.
