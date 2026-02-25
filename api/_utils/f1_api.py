"""
Jolpica F1 API client for fetching race results and qualifying data.

Base URL: https://api.jolpi.ca/ergast/f1/

Rate limits:
  - 4 requests/second
  - 200 requests/hour

Endpoints used:
  - GET /{season}/{round}/results.json      — Race results
  - GET /{season}/{round}/qualifying.json   — Qualifying (pole position)
  - GET /{season}/{round}/sprint.json       — Sprint results
"""

import time
import requests

JOLPICA_BASE_URL = "https://api.jolpi.ca/ergast/f1"

# Mapping for specific Ergast driver IDs to our presets.
DRIVER_MAPPING = {
    "max_verstappen": "verstappen",
}

# Mapping for Ergast constructor IDs to our presets
CONSTRUCTOR_MAPPING = {
    "red_bull": "redbull",
    "aston_martin": "astonmartin",
    "haas": "haas",
    "alpine": "alpine",
    "williams": "williams",
    "mclaren": "mclaren",
    "ferrari": "ferrari",
    "mercedes": "mercedes",
    "audi": "audi",
    "rb": "rb",
    "cadillac": "cadillac"
}

def map_driver_id(ergast_id: str) -> str:
    if ergast_id in DRIVER_MAPPING:
        return DRIVER_MAPPING[ergast_id]
    parts = ergast_id.split('_')
    return parts[-1].lower()

def map_constructor_id(ergast_id: str) -> str:
    return CONSTRUCTOR_MAPPING.get(ergast_id, ergast_id.replace('_', ''))

def fetch_with_retry(url: str, retries: int = 3) -> dict:
    for attempt in range(retries):
        try:
            time.sleep(0.3)
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 429:
                time.sleep(2 ** attempt)
            else:
                response.raise_for_status()
        except Exception as e:
            if attempt == retries - 1:
                print(f"Failed to fetch {url}: {e}")
                return [] if "openf1" in url else {}
            time.sleep(2 ** attempt)
    return [] if "openf1" in url else {}

def get_openf1_session_key(season: int, round_num: int, session_name: str):
    races_data = fetch_with_retry(f"https://api.openf1.org/v1/sessions?year={season}&session_name=Race")
    if not races_data:
        return None
    races_data.sort(key=lambda x: x.get("date_start", ""))
    
    if round_num > len(races_data):
        return None
        
    meeting_key = races_data[round_num - 1].get("meeting_key")
    
    if session_name == "Race":
        return races_data[round_num - 1].get("session_key")
    else:
        sprints_data = fetch_with_retry(f"https://api.openf1.org/v1/sessions?meeting_key={meeting_key}&session_name=Sprint")
        if sprints_data:
            return sprints_data[0].get("session_key")
        return None

def detect_race_interruptions(season: int, round_num: int, is_sprint: bool) -> tuple[bool, bool]:
    session_name = "Sprint" if is_sprint else "Race"
    session_key = get_openf1_session_key(season, round_num, session_name)
    
    if not session_key:
        return False, False
        
    rc_data = fetch_with_retry(f"https://api.openf1.org/v1/race_control?session_key={session_key}")
    if not rc_data:
        return False, False
        
    safety_car = False
    red_flag = False
    
    for msg in rc_data:
        if msg.get("category") == "SafetyCar":
            safety_car = True
        if msg.get("flag") == "RED":
            red_flag = True
            
    return safety_car, red_flag

def fetch_race_results(season: int, round_num: int) -> dict:
    url = f"{JOLPICA_BASE_URL}/{season}/{round_num}/results.json"
    data = fetch_with_retry(url)
    
    try:
        race_data = data["MRData"]["RaceTable"]["Races"][0]
        results = race_data["Results"]
    except (KeyError, IndexError):
        return {}
        
    extracted = {}
    
    # Drivers P1-P10
    for i, res in enumerate(results[:10]):
        pos = i + 1
        driver_id = map_driver_id(res["Driver"]["driverId"])
        extracted[f"p{pos}_driver"] = driver_id
        
    # Constructors P1-P5
    constructor_points = {}
    for res in results:
        constructor_id = map_constructor_id(res["Constructor"]["constructorId"])
        points = float(res.get("points", 0))
        constructor_points[constructor_id] = constructor_points.get(constructor_id, 0) + points
        
    sorted_constructors = sorted(constructor_points.items(), key=lambda x: x[1], reverse=True)
    for i, (cons_id, _) in enumerate(sorted_constructors[:5]):
        pos = i + 1
        extracted[f"c{pos}_constructor"] = cons_id
        
    fastest_lap_driver = None
    first_retirement_driver = None
    min_laps_completed = float('inf')
    
    for res in results:
        driver_id = map_driver_id(res["Driver"]["driverId"])
        
        # Fastest Lap
        if res.get("FastestLap", {}).get("rank") == "1":
            fastest_lap_driver = driver_id
            
        # First Retirement
        status = res.get("status", "")
        if "Finished" not in status and "+" not in status and "Lapped" not in status:
            laps = int(res.get("laps", 0))
            if laps < min_laps_completed:
                min_laps_completed = laps
                first_retirement_driver = driver_id
                
    extracted["fastest_lap"] = fastest_lap_driver
    extracted["first_retirement"] = first_retirement_driver
    
    # Qualifying (Pole)
    qual_url = f"{JOLPICA_BASE_URL}/{season}/{round_num}/qualifying.json"
    qual_data = fetch_with_retry(qual_url)
    try:
        qual_results = qual_data["MRData"]["RaceTable"]["Races"][0]["QualifyingResults"]
        extracted["pole_position"] = map_driver_id(qual_results[0]["Driver"]["driverId"])
    except (KeyError, IndexError):
        for res in results:
            if res.get("grid") == "1":
                extracted["pole_position"] = map_driver_id(res["Driver"]["driverId"])
                break
                
    sc, rf = detect_race_interruptions(season, round_num, is_sprint=False)
    extracted["safety_car"] = sc
    extracted["red_flag"] = rf
                
    return extracted

def fetch_sprint_results(season: int, round_num: int) -> dict:
    url = f"{JOLPICA_BASE_URL}/{season}/{round_num}/sprint.json"
    data = fetch_with_retry(url)
    
    try:
        race_data = data["MRData"]["RaceTable"]["Races"][0]
        results = race_data["SprintResults"]
    except (KeyError, IndexError):
        return {}
        
    extracted = {}
    
    for i, res in enumerate(results[:8]):
        pos = i + 1
        driver_id = map_driver_id(res["Driver"]["driverId"])
        extracted[f"sp{pos}_driver"] = driver_id
        
    constructor_points = {}
    for res in results:
        constructor_id = map_constructor_id(res["Constructor"]["constructorId"])
        points = float(res.get("points", 0))
        constructor_points[constructor_id] = constructor_points.get(constructor_id, 0) + points
        
    sorted_constructors = sorted(constructor_points.items(), key=lambda x: x[1], reverse=True)
    for i, (cons_id, _) in enumerate(sorted_constructors[:5]):
        pos = i + 1
        extracted[f"c{pos}_constructor"] = cons_id
        
    fastest_lap_driver = None
    first_retirement_driver = None
    min_laps_completed = float('inf')
    
    for res in results:
        driver_id = map_driver_id(res["Driver"]["driverId"])
        
        if res.get("FastestLap", {}).get("rank") == "1":
            fastest_lap_driver = driver_id
            
        status = res.get("status", "")
        if "Finished" not in status and "+" not in status and "Lapped" not in status:
            laps = int(res.get("laps", 0))
            if laps < min_laps_completed:
                min_laps_completed = laps
                first_retirement_driver = driver_id

    extracted["fastest_lap"] = fastest_lap_driver
    extracted["first_retirement"] = first_retirement_driver
    
    # Assume pole is grid position 1
    for res in results:
        if res.get("grid") == "1":
            extracted["pole_position"] = map_driver_id(res["Driver"]["driverId"])
            break
            
    sc, rf = detect_race_interruptions(season, round_num, is_sprint=True)
    extracted["safety_car"] = sc
    extracted["red_flag"] = rf

    return extracted
