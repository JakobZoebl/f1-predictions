# F1 Race and Sprint Names Mapping
# Derived from src/lib/f1-presets.ts

RACE_NAMES = {
    1: "Australian Grand Prix",
    2: "Chinese Grand Prix",
    3: "Japanese Grand Prix",
    4: "Bahrain Grand Prix",
    5: "Saudi Arabian Grand Prix",
    6: "Miami Grand Prix",
    7: "Canadian Grand Prix",
    8: "Monaco Grand Prix",
    9: "Spanish Grand Prix (Barcelona)",
    10: "Austrian Grand Prix",
    11: "British Grand Prix",
    12: "Belgian Grand Prix",
    13: "Hungarian Grand Prix",
    14: "Dutch Grand Prix",
    15: "Italian Grand Prix",
    16: "Spanish Grand Prix (Madrid)",
    17: "Azerbaijan Grand Prix",
    18: "Singapore Grand Prix",
    19: "United States Grand Prix",
    20: "Mexico City Grand Prix",
    21: "São Paulo Grand Prix",
    22: "Las Vegas Grand Prix",
    23: "Qatar Grand Prix",
    24: "Abu Dhabi Grand Prix",
}

SPRINT_NAMES = {
    2: "Chinese Grand Prix Sprint",
    6: "Miami Grand Prix Sprint",
    7: "Canadian Grand Prix Sprint",
    11: "British Grand Prix Sprint",
    14: "Dutch Grand Prix Sprint",
    18: "Singapore Grand Prix Sprint",
}

def get_session_name(round_num: int, session_type: str) -> str:
    """
    Get the name of a race or sprint based on round and session type.
    """
    if session_type == 'sprint':
        return SPRINT_NAMES.get(round_num, f"Sprint Round {round_num}")
    return RACE_NAMES.get(round_num, f"Grand Prix Round {round_num}")
