# F1 Race and Sprint Names Mapping
# Derived from src/lib/f1-presets.ts

RACE_NAMES = {
    1: "Australian Grand Prix",
    2: "Chinese Grand Prix",
    3: "Japanese Grand Prix",
    4: "Miami Grand Prix",
    5: "Canadian Grand Prix",
    6: "Monaco Grand Prix",
    7: "Spanish Grand Prix (Barcelona)",
    8: "Austrian Grand Prix",
    9: "British Grand Prix",
    10: "Belgian Grand Prix",
    11: "Hungarian Grand Prix",
    12: "Dutch Grand Prix",
    13: "Italian Grand Prix",
    14: "Spanish Grand Prix (Madrid)",
    15: "Azerbaijan Grand Prix",
    16: "Bahrain Grand Prix",
    17: "Singapore Grand Prix",
    18: "United States Grand Prix",
    19: "Mexico City Grand Prix",
    20: "São Paulo Grand Prix",
    21: "Las Vegas Grand Prix",
    22: "Qatar Grand Prix",
    23: "Abu Dhabi Grand Prix",
    105: "Saudi Arabian Grand Prix",
}

SPRINT_NAMES = {
    2: "Chinese Grand Prix Sprint",
    4: "Miami Grand Prix Sprint",
    5: "Canadian Grand Prix Sprint",
    9: "British Grand Prix Sprint",
    12: "Dutch Grand Prix Sprint",
    17: "Singapore Grand Prix Sprint",
}

def get_session_name(round_num: int, session_type: str) -> str:
    """
    Get the name of a race or sprint based on round and session type.
    """
    if session_type == 'sprint':
        return SPRINT_NAMES.get(round_num, f"Sprint Round {round_num}")
    return RACE_NAMES.get(round_num, f"Grand Prix Round {round_num}")
