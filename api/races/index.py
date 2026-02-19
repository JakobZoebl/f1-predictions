"""
GET /api/races

List all races with optional filtering.

Query params (all optional):
    - season: int (default: current year)
    - status: 'upcoming' | 'locked' | 'completed'

Response:
    {
        "races": [
            {
                "id": 1,
                "season": 2026,
                "round": 1,
                "name": "Bahrain Grand Prix",
                "circuit": "Bahrain International Circuit",
                "country": "BH",
                "date": "2026-03-01T15:00:00Z",
                "cutoff": "2026-02-28T14:00:00Z",
                "has_sprint": false,
                "status": "upcoming"
            }
        ]
    }
"""

from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/api/races', methods=['GET'])
def get_races():
    """
    Fetch all races, optionally filtered by season and status.
    
    Steps:
        1. Parse query params (season, status)
        2. Query races table with filters
        3. Order by date ascending
        4. Return list of races
    """
    # TODO: Implement race listing
    pass
