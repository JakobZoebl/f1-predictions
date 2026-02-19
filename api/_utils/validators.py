"""
Input validation helpers for API endpoints.

Provides validation functions for predictions, user profiles,
and other request data. Server-side validation is critical
even when client-side validation exists.
"""

import re


def validate_signup(data: dict) -> tuple[bool, str | None]:
    """
    Validate signup request data.
    
    Checks:
      - Email format
      - Username: 3-30 chars, alphanumeric + _ -
      - Display name: 1-50 chars
      - Password: minimum 8 characters
      
    Args:
        data: The signup request body.
        
    Returns:
        tuple: (is_valid, error_message)
    """
    email = data.get("email", "").strip()
    username = data.get("username", "").strip()
    display_name = data.get("display_name", "").strip()
    password = data.get("password", "")

    # Email validation
    if not email:
        return False, "Email is required."
    email_regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    if not re.match(email_regex, email):
        return False, "Invalid email format."

    # Username validation
    if not username:
        return False, "Username is required."
    if len(username) < 3:
        return False, "Username must be at least 3 characters."
    if len(username) > 30:
        return False, "Username must be at most 30 characters."
    username_regex = r"^[a-zA-Z0-9_-]+$"
    if not re.match(username_regex, username):
        return False, "Username can only contain letters, numbers, _ and -."

    # Display name validation
    if not display_name:
        return False, "Display name is required."
    if len(display_name) > 50:
        return False, "Display name must be at most 50 characters."

    # Password validation
    if not password:
        return False, "Password is required."
    if len(password) < 8:
        return False, "Password must be at least 8 characters."

    return True, None


def validate_race_prediction(data: dict) -> tuple[bool, str | None]:
    """
    Validate a race prediction submission.
    
    Checks:
      - All 10 driver positions are filled (p1_driver..p10_driver)
      - All 5 constructor positions are filled (c1_constructor..c5_constructor)
      - No duplicate drivers in top 10
      - No duplicate constructors in top 5
      - Bonus fields present (pole_position, fastest_lap, etc.)
      - safety_car and red_flag are booleans
    
    Args:
        data: The prediction request body.
        
    Returns:
        tuple: (is_valid: bool, error_message: str | None)
    """
    # Validate drivers
    driver_keys = [f"p{i}_driver" for i in range(1, 11)]
    drivers = []
    for key in driver_keys:
        val = data.get(key, "").strip() if isinstance(data.get(key), str) else ""
        if not val:
            return False, f"Missing driver for position {key}."
        drivers.append(val)
    if len(set(drivers)) != len(drivers):
        return False, "Duplicate drivers found in top 10."

    # Validate constructors
    constructor_keys = [f"c{i}_constructor" for i in range(1, 6)]
    constructors = []
    for key in constructor_keys:
        val = data.get(key, "").strip() if isinstance(data.get(key), str) else ""
        if not val:
            return False, f"Missing constructor for position {key}."
        constructors.append(val)
    if len(set(constructors)) != len(constructors):
        return False, "Duplicate constructors found in top 5."

    # Validate bonus fields
    for field in ["pole_position", "fastest_lap", "first_retirement"]:
        if not data.get(field, "").strip() if isinstance(data.get(field), str) else not data.get(field):
            return False, f"Missing bonus field: {field}."

    for field in ["safety_car", "red_flag"]:
        if not isinstance(data.get(field), bool):
            return False, f"{field} must be a boolean."

    return True, None


def validate_sprint_prediction(data: dict) -> tuple[bool, str | None]:
    """
    Validate a sprint prediction submission.
    
    Checks:
      - All 8 sprint positions filled (sp1_driver..sp8_driver)
      - No duplicate drivers
      - Bonus fields present
      
    Args:
        data: The sprint prediction request body.
        
    Returns:
        tuple: (is_valid, error_message)
    """
    driver_keys = [f"sp{i}_driver" for i in range(1, 9)]
    drivers = []
    for key in driver_keys:
        val = data.get(key, "").strip() if isinstance(data.get(key), str) else ""
        if not val:
            return False, f"Missing driver for sprint position {key}."
        drivers.append(val)
    if len(set(drivers)) != len(drivers):
        return False, "Duplicate drivers found in sprint top 8."

    for field in ["pole_position", "fastest_lap", "first_retirement"]:
        if not data.get(field, "").strip() if isinstance(data.get(field), str) else not data.get(field):
            return False, f"Missing bonus field: {field}."

    for field in ["safety_car", "red_flag"]:
        if not isinstance(data.get(field), bool):
            return False, f"{field} must be a boolean."

    return True, None


def validate_season_prediction(data: dict) -> tuple[bool, str | None]:
    """
    Validate a season prediction submission.
    
    Checks:
      - All 20 driver positions filled (d1_driver..d20_driver)
      - All 10 constructor positions filled (c1_constructor..c10_constructor)
      - No duplicate drivers
      - No duplicate constructors
      - most_poles and most_fastest_laps present
      
    Args:
        data: The season prediction request body.
        
    Returns:
        tuple: (is_valid, error_message)
    """
    driver_keys = [f"d{i}_driver" for i in range(1, 21)]
    drivers = []
    for key in driver_keys:
        val = data.get(key, "").strip() if isinstance(data.get(key), str) else ""
        if not val:
            return False, f"Missing driver for season position {key}."
        drivers.append(val)
    if len(set(drivers)) != len(drivers):
        return False, "Duplicate drivers found in season predictions."

    constructor_keys = [f"c{i}_constructor" for i in range(1, 11)]
    constructors = []
    for key in constructor_keys:
        val = data.get(key, "").strip() if isinstance(data.get(key), str) else ""
        if not val:
            return False, f"Missing constructor for season position {key}."
        constructors.append(val)
    if len(set(constructors)) != len(constructors):
        return False, "Duplicate constructors found in season predictions."

    for field in ["most_poles", "most_fastest_laps"]:
        if not data.get(field, "").strip() if isinstance(data.get(field), str) else not data.get(field):
            return False, f"Missing required field: {field}."

    return True, None


def validate_profile_update(data: dict) -> tuple[bool, str | None]:
    """
    Validate a profile update request.
    
    Checks:
      - display_name length (1-50 chars)
      - favorite_team_id is a string if provided
      - favorite_driver_id is a string if provided
      
    Args:
        data: The profile update request body.
        
    Returns:
        tuple: (is_valid, error_message)
    """
    display_name = data.get("display_name")
    if display_name is not None:
        if not isinstance(display_name, str) or not display_name.strip():
            return False, "Display name must be a non-empty string."
        if len(display_name.strip()) > 50:
            return False, "Display name must be at most 50 characters."

    for field in ["favorite_team_id", "favorite_driver_id"]:
        val = data.get(field)
        if val is not None and not isinstance(val, str):
            return False, f"{field} must be a string."

    return True, None
