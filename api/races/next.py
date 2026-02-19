"""
GET /api/races/next

Get the next upcoming race with countdown information.

Response:
    {
        "race": {
            "id": 5,
            "name": "Monaco Grand Prix",
            "circuit": "Circuit de Monaco",
            "country": "MC",
            "date": "2026-05-24T13:00:00Z",
            "cutoff": "2026-05-23T12:00:00Z",
            "has_sprint": false,
            "countdown_seconds": 86400
        }
    }
    
    Returns null if no upcoming races remain in the season.
"""

from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/api/races/next', methods=['GET'])
def get_next_race():
    """
    Fetch the next upcoming race.
    
    Steps:
        1. Query races with status='upcoming' ordered by date
        2. Pick the first (soonest) race
        3. Calculate countdown_seconds from now to cutoff
        4. Return race info or null
    """
    # TODO: Implement next race lookup
    pass
