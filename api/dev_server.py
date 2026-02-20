"""
Local development server that combines all API endpoints into a single Flask app.

Usage:
    python api/dev_server.py

This replaces 'vercel dev' for local testing. Run this alongside 'npm run dev'
(Vite handles the frontend on :5173, and vite.config.ts proxies /api/* to :5328).
"""

import os
import sys

# Ensure project root is on sys.path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env'))

# Import the main app which has all blueprints registered
from api.index import app

# Keep cron separate functionally but load it locally for dev testing if accessed directly
from api.cron.fetch_results import app as cron_fetch_app

# Add cron routes onto the main development app manually since it's a separate Vercel function in prod
for rule in cron_fetch_app.url_map.iter_rules():
    if rule.endpoint == 'static':
        continue
    app.add_url_rule(
        rule.rule,
        endpoint=f"cron_{rule.endpoint}",
        view_func=cron_fetch_app.view_functions[rule.endpoint],
        methods=rule.methods - {'OPTIONS', 'HEAD'}
    )

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
