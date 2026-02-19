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

JOLPICA_BASE_URL = "https://api.jolpi.ca/ergast/f1"


def fetch_race_results(season: int, round_num: int) -> dict:
    """
    Fetch race results from the Jolpica API.
    
    Args:
        season: The F1 season year (e.g., 2026).
        round_num: The race round number.
        
    Returns:
        dict: Parsed results matching our race_results schema
              (p1_driver..p10_driver, c1..c5, pole, fastest_lap, etc.)
    """
    # TODO: Call Jolpica API
    # TODO: Parse response into our schema format
    # TODO: Handle rate limiting and retries
    pass


def fetch_qualifying_results(season: int, round_num: int) -> dict:
    """
    Fetch qualifying results to determine pole position.
    
    Args:
        season: The F1 season year.
        round_num: The race round number.
        
    Returns:
        dict: {'pole_position': 'Driver Name'}
    """
    # TODO: Call Jolpica qualifying endpoint
    # TODO: Extract P1 qualifier
    pass


def fetch_sprint_results(season: int, round_num: int) -> dict:
    """
    Fetch sprint race results from the Jolpica API.
    
    Args:
        season: The F1 season year.
        round_num: The race round number.
        
    Returns:
        dict: Parsed results matching our sprint_results schema.
    """
    # TODO: Call Jolpica sprint endpoint
    # TODO: Parse top 8 finishers
    pass


def parse_race_response(api_data: dict) -> dict:
    """
    Parse raw Jolpica API response into our database schema format.
    
    Args:
        api_data: Raw JSON from the Jolpica API.
        
    Returns:
        dict: Formatted result matching race_results table columns.
    """
    # TODO: Extract driver names, constructor standings
    # TODO: Find fastest lap holder
    # TODO: Determine first retirement
    pass


def fetch_with_retry(url: str, retries: int = 3) -> dict:
    """
    Fetch a URL with exponential backoff retry logic.
    
    Args:
        url: The API URL to fetch.
        retries: Number of retry attempts.
        
    Returns:
        dict: Parsed JSON response.
        
    Raises:
        Exception: If all retries fail.
    """
    # TODO: Implement retry with exponential backoff
    # TODO: Respect rate limits (250ms between requests)
    pass
