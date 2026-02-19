"""
Points calculation logic for F1 predictions.

Implements the scoring rules from the project specification:
  - Race predictions: Top 10 drivers, Top 5 constructors, bonus predictions
  - Sprint predictions: Top 8 drivers + bonus
  - Season predictions: Full championship standings

Scoring reference (race):
  - Exact position: 25, 18, 15, 12, 10, 8, 6, 4, 2, 1
  - In top 10 but wrong position: 2 points
  - Constructors exact: 25, 18, 15, 12, 10
  - Constructor in top 5 but wrong position: 10 points
  - Bonus: Pole (10), Fastest Lap (10), First Retirement (10),
           Safety Car (5), Red Flag (1 for No / 5 for Yes)
"""

# F1 points for positions 1-10
RACE_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]

# Sprint points for positions 1-8
SPRINT_POINTS = [8, 7, 6, 5, 4, 3, 2, 1]

# Season multiplier
SEASON_MULTIPLIER = 10

# Constructor points for positions 1-5
CONSTRUCTOR_POINTS = [25, 18, 15, 12, 10]


def calculate_race_points(prediction: dict, result: dict) -> dict:
    """
    Calculate points for a race prediction against actual results.
    
    Args:
        prediction: Dict with p1_driver..p10_driver, c1_constructor..c5_constructor,
                    pole_position, fastest_lap, first_retirement, safety_car, red_flag
        result: Dict with same keys from race_results table.
        
    Returns:
        dict: {
            'total_points': int,
            'breakdown': {
                'driver_positions': int,
                'constructors': int,
                'pole_position': int,
                'fastest_lap': int,
                'first_retirement': int,
                'safety_car': int,
                'red_flag': int
            }
        }
    """
    # TODO: Compare each driver position
    # TODO: Compare each constructor position
    # TODO: Compare bonus predictions
    # TODO: Return total and breakdown
    pass


def calculate_sprint_points(prediction: dict, result: dict) -> dict:
    """
    Calculate points for a sprint prediction against actual results.
    
    Args:
        prediction: Dict with sp1_driver..sp8_driver + bonus fields.
        result: Dict with same keys from sprint_results table.
        
    Returns:
        dict: Same structure as calculate_race_points.
    """
    # TODO: Similar to race but with sprint scoring (top 8, different points)
    pass


def calculate_season_points(prediction: dict, actual_standings: dict) -> dict:
    """
    Calculate points for season-long predictions against final standings.
    
    Args:
        prediction: Dict with d1_driver..d20_driver, c1_constructor..c11_constructor,
                    most_poles, most_fastest_laps.
        actual_standings: Dict with actual championship positions.
        
    Returns:
        dict: Total points and breakdown.
    """
    # TODO: Apply 10x multiplier scoring
    # TODO: Handle positions 11-20 (10 points each for exact)
    # TODO: Score most_poles and most_fastest_laps (100 each)
    pass
