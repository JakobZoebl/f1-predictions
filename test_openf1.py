import sys
import os
sys.path.append(os.path.abspath('.'))

from api._utils.f1_api import fetch_race_results, fetch_sprint_results

try:
    race_res = fetch_race_results(2024, 21)
    sprint_res = fetch_sprint_results(2024, 21)

    with open('openf1_test_output.txt', 'w') as f:
        f.write(f"RACE SC: {race_res.get('safety_car')}, RACE RF: {race_res.get('red_flag')}\n")
        f.write(f"SPRINT SC: {sprint_res.get('safety_car')}, SPRINT RF: {sprint_res.get('red_flag')}\n")
except Exception as e:
    with open('openf1_test_output.txt', 'w') as f:
        f.write(f"ERROR: {e}")
