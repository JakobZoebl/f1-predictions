import os
import sys

# Add the parent directory to sys.path to allow imports from api._utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Blueprint, request, jsonify, g
from api._utils.supabase_client import get_supabase_client
from api._utils.auth_helpers import get_current_user

predictions_bp = Blueprint('predictions', __name__)

@predictions_bp.route('/api/predictions', methods=['GET', 'POST', 'OPTIONS'])
def handle_prediction():
    """
    Handle unified prediction fetch and submission.
    Accepts: ?session_type=race|sprint|season (GET)
             { "session_type": "race" | "sprint" | "season", ...prediction_data } (POST)
    """
    # Handle CORS preflight request
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    # Ensure user is authenticated
    try:
        user = get_current_user(request)
    except ValueError as e:
        return jsonify({"error": str(e)}), 401
    
    user_id = user.get('id')
    supabase = get_supabase_client()

    if request.method == 'GET':
        session_type = request.args.get('session_type')
        race_id = request.args.get('race_id')

        if not session_type:
            return jsonify({'error': 'Missing session_type'}), 400

        if session_type == 'race':
            if not race_id:
                return jsonify({'error': 'Missing race_id for race predictions'}), 400
            
            try:
                response = supabase.table('predictions').select('*').eq('user_id', user_id).eq('race_id', race_id).execute()
                if not response.data:
                    return jsonify({'prediction': None}), 200
                return jsonify({'prediction': response.data[0]}), 200
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        
        # Add support for sprint/season GET later
        return jsonify({'error': 'Unsupported session_type for GET'}), 400

    if request.method == 'POST':
        data = request.json
        if not data:
            return jsonify({'error': 'Invalid payload'}), 400

        session_type = data.get('session_type')
        if not session_type:
            return jsonify({'error': 'Missing session_type in payload'}), 400
        
        if session_type == 'race':
            race_id = data.get('race_id')
            drivers = data.get('drivers', [])
            constructors = data.get('constructors', [])
            bonus = data.get('bonus', {})

            if not race_id:
                return jsonify({'error': 'Missing race_id for race predictions POST'}), 400

            # Pad drivers and constructors with None if they are fewer than required
            drivers = drivers + [None] * (10 - len(drivers))
            constructors = constructors + [None] * (5 - len(constructors))

            insert_data = {
                'user_id': user_id,
                'race_id': race_id,
                'p1_driver': drivers[0], 'p2_driver': drivers[1], 'p3_driver': drivers[2],
                'p4_driver': drivers[3], 'p5_driver': drivers[4], 'p6_driver': drivers[5],
                'p7_driver': drivers[6], 'p8_driver': drivers[7], 'p9_driver': drivers[8],
                'p10_driver': drivers[9],
                'c1_constructor': constructors[0], 'c2_constructor': constructors[1], 
                'c3_constructor': constructors[2], 'c4_constructor': constructors[3], 
                'c5_constructor': constructors[4],
                'pole_position': bonus.get('pole_position'),
                'fastest_lap': bonus.get('fastest_lap'),
                'first_retirement': bonus.get('first_retirement'),
                'safety_car': bonus.get('safety_car'),
                'red_flag': bonus.get('red_flag')
            }

            try:
                # Upsert prediction data. We can accomplish upsert in Supabase by inserting 
                # and using on_conflict. The conflict target should be UNIQUE(user_id, race_id)
                response = supabase.table('predictions').upsert(
                    insert_data, 
                    on_conflict='user_id, race_id'
                ).execute()
                return jsonify({'message': 'Prediction saved successfully!'}), 200
            except Exception as e:
                return jsonify({'error': str(e)}), 500

        # Add support for sprint/season POST later
        return jsonify({'error': 'Unsupported session_type for POST'}), 400

