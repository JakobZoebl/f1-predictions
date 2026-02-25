import requests
import json
import time

JOLPICA_BASE_URL = "https://api.jolpi.ca/ergast/f1"

def fetch_with_retry(url, retries=3):
    print(f"Fetching {url}...")
    for attempt in range(retries):
        try:
            time.sleep(0.3)
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                print(f"Success! Status Code: {response.status_code}")
                return response.json()
            elif response.status_code == 429:
                print(f"Rate limited. Retrying...")
                time.sleep(2 ** attempt)
            else:
                print(f"HTTP Error: {response.status_code}")
                response.raise_for_status()
        except Exception as e:
            if attempt == retries - 1:
                print(f"Failed to fetch {url}: {e}")
                return {}
            time.sleep(2 ** attempt)
    return {}

if __name__ == "__main__":
    season = 2024
    
    # 2024 Round 2 (Saudi Arabia) had a race, no sprint
    # Let's test China 2024 (Round 5) which had a sprint
    
    round_num = 5 
    
    print(f"--- F1 ERGAST API TEST: {season} Round {round_num} ---")
    
    # Test Qualifying (Pole Position)
    qual_url = f"{JOLPICA_BASE_URL}/{season}/{round_num}/qualifying.json"
    qual_data = fetch_with_retry(qual_url)
    print("\n--- QUALIFYING RESULTS JSON ---")
    # Only print partial data to avoid massive console output
    if "MRData" in qual_data:
        try:
            print(json.dumps(qual_data["MRData"]["RaceTable"]["Races"][0]["QualifyingResults"][:3], indent=2))
            print("... (truncated)")
        except Exception as e:
            print("Error parsing qualy:", e)

    # Test Sprint
    sprint_url = f"{JOLPICA_BASE_URL}/{season}/{round_num}/sprint.json"
    sprint_data = fetch_with_retry(sprint_url)
    print("\n--- SPRINT RESULTS JSON ---")
    if "MRData" in sprint_data:
        try:
            print(json.dumps(sprint_data["MRData"]["RaceTable"]["Races"][0]["SprintResults"][:3], indent=2))
            print("... (truncated)")
        except Exception as e:
            print("No sprint data for this round or error parsing:", e)
            
    # Test Race
    race_url = f"{JOLPICA_BASE_URL}/{season}/{round_num}/results.json"
    race_data = fetch_with_retry(race_url)
    print("\n--- RACE RESULTS JSON ---")
    if "MRData" in race_data:
        try:
            print(json.dumps(race_data["MRData"]["RaceTable"]["Races"][0]["Results"][:3], indent=2))
            print("... (truncated)")
        except Exception as e:
            print("Error parsing race:", e)
            
    # Print the specific fastest lap of a driver if needed, e.g., driver at index 0
    if "MRData" in race_data:
        try:
            first_driver = race_data["MRData"]["RaceTable"]["Races"][0]["Results"][0]
            print("\n--- SPECIFIC DATA FOR P1 FINISHER ---")
            print("Constructor:")
            print(json.dumps(first_driver.get("Constructor", {}), indent=2))
            print("Fastest Lap Info:")
            print(json.dumps(first_driver.get("FastestLap", {}), indent=2))
            print("Status:")
            print(first_driver.get("status"))
        except Exception as e:
            pass
