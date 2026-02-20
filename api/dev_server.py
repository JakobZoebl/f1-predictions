"""
Local development server that combines all API endpoints into a single Flask app.

Usage:
    python api/dev_server.py

This replaces 'vercel dev' for local testing. Run this alongside 'npm run dev'
(Vite handles the frontend on :5173, and vite.config.ts proxies /api/* to :5328).

This file is NOT deployed to Vercel — each .py file in api/ is deployed
as its own serverless function. This server is only for local development.
"""

import os
import sys

# Ensure project root is on sys.path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env'))

app = Flask(__name__)

# ---------------------------------------------------------------------------
# Register all routes by importing each endpoint module and copying its rules
# ---------------------------------------------------------------------------

def _register_routes_from(module_app):
    """Copy all routes from a module's Flask app into the main dev server app."""
    for rule in module_app.url_map.iter_rules():
        if rule.endpoint == 'static':
            continue
        view_func = module_app.view_functions[rule.endpoint]
        # Avoid duplicate endpoint names by prefixing with the route
        endpoint_name = f"{rule.rule.replace('/', '_').strip('_')}"
        app.add_url_rule(
            rule.rule,
            endpoint=endpoint_name,
            view_func=view_func,
            methods=rule.methods - {'OPTIONS', 'HEAD'}
        )


# --- Health check ---
from api.index import app as index_app
_register_routes_from(index_app)

# --- Auth ---
from api.auth.login import app as login_app
_register_routes_from(login_app)

from api.auth.signup import app as signup_app
_register_routes_from(signup_app)

from api.auth.logout import app as logout_app
_register_routes_from(logout_app)

from api.auth.reset_password import app as reset_password_app
_register_routes_from(reset_password_app)

from api.auth.update_password import app as update_password_app
_register_routes_from(update_password_app)

# --- Profile ---
from api.profile.index import app as profile_app
_register_routes_from(profile_app)

from api.profile.preferences import app as preferences_app
_register_routes_from(preferences_app)

# --- Predictions ---
from api.predictions.race import app as pred_race_app
_register_routes_from(pred_race_app)

from api.predictions.season import app as pred_season_app
_register_routes_from(pred_season_app)

from api.predictions.sprint import app as pred_sprint_app
_register_routes_from(pred_sprint_app)

# --- Leaderboard ---
from api.leaderboard.index import app as leaderboard_app
_register_routes_from(leaderboard_app)

from api.leaderboard.chart_data import app as chart_data_app
_register_routes_from(chart_data_app)

# --- Results ---
from api.results.race import app as results_race_app
_register_routes_from(results_race_app)

from api.results.sprint import app as results_sprint_app
_register_routes_from(results_sprint_app)

# --- Admin ---
from api.admin.races import app as admin_races_app
_register_routes_from(admin_races_app)

from api.admin.results import app as admin_results_app
_register_routes_from(admin_results_app)

from api.admin.sprint_results import app as admin_sprint_results_app
_register_routes_from(admin_sprint_results_app)

from api.admin.calculate_points import app as admin_calc_points_app
_register_routes_from(admin_calc_points_app)

from api.admin.fetch_results import app as admin_fetch_results_app
_register_routes_from(admin_fetch_results_app)

# --- Cron ---
from api.cron.fetch_results import app as cron_fetch_app
_register_routes_from(cron_fetch_app)


# ---------------------------------------------------------------------------

if __name__ == '__main__':
    print("\n  F1 Predictions API - Local Dev Server")
    print("=" * 50)
    print("Registered routes:")
    for rule in sorted(app.url_map.iter_rules(), key=lambda r: r.rule):
        if rule.endpoint == 'static':
            continue
        methods = ', '.join(sorted(rule.methods - {'OPTIONS', 'HEAD'}))
        print(f"  {methods:10s} {rule.rule}")
    print("=" * 50)
    print("Server running at http://localhost:5328\n")

    app.run(host='0.0.0.0', port=5328, debug=True)
