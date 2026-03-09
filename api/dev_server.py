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

# Cron routes are now registered as a Blueprint in api/index.py,
# so they are automatically available on the main app.

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
