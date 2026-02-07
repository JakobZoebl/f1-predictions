from flask import Flask, request, jsonify
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Initialize Supabase Client
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = None

if url and key:
    supabase = create_client(url, key)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "f1-predictions-api"})

@app.route('/api/races', methods=['GET'])
def get_races():
    if not supabase:
        return jsonify({"error": "Database connection not configured"}), 500
    
    try:
        response = supabase.table('races').select("*").order('date').execute()
        return jsonify({"races": response.data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/predictions/race', methods=['POST'])
def submit_race_prediction():
    if not supabase:
        return jsonify({"error": "Database connection not configured"}), 500
        
    data = request.json
    # TODO: Validate user session here (or rely on RLS/Supabase Auth in frontend)
    # Ideally verify the JWT token passed in headers
    
    try:
        response = supabase.table('predictions').upsert(data).execute()
        return jsonify({"success": True, "data": response.data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Vercel Serverless Function Entrypoint
# Note: Vercel looks for 'app' by default in index.py
