"""
Shared Supabase client initialization.

Provides a singleton Supabase client using the service role key
for server-side operations. Used by all API endpoints.

Includes retry logic for HTTP/2 connection errors (RemoteProtocolError)
that occur when the server drops idle connections.

Environment variables required:
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
"""

import os
import httpx
import httpcore
from supabase import create_client, Client

# Module-level cache for the Supabase client
_supabase_client: Client | None = None


def get_supabase_client() -> Client:
    """
    Create and return a Supabase client using service role credentials.
    
    Uses module-level caching so the client is reused across invocations
    within the same serverless function lifecycle.
    
    Returns:
        Client: Authenticated Supabase client instance.
    
    Raises:
        ValueError: If required environment variables are not set.
    """
    global _supabase_client

    if _supabase_client is not None:
        return _supabase_client

    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not url or not key:
        raise ValueError(
            "Missing required environment variables: "
            "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set."
        )

    _supabase_client = create_client(url, key)
    return _supabase_client


def reset_supabase_client():
    """Clear the cached client to force a fresh connection on next call."""
    global _supabase_client
    _supabase_client = None


# Transport-level errors that indicate a stale/broken HTTP connection
_RETRYABLE_ERRORS = (
    httpx.RemoteProtocolError,
    httpcore.RemoteProtocolError,
    httpx.ConnectError,
    httpx.ReadError,
)


def execute_with_retry(operation, max_retries=1):
    """
    Execute a Supabase operation with automatic retry on connection errors.
    
    When the HTTP/2 connection pool becomes stale (server drops the idle
    connection), the cached client is reset and the operation is retried
    with a fresh connection.
    
    Args:
        operation: A callable (typically a lambda or inner function) that
                   performs the Supabase DB interaction and returns a response.
        max_retries: Number of retries on transport-level errors (default 1).
    
    Returns:
        The return value of the operation callable.
    
    Raises:
        The original exception if all retries are exhausted.
    """
    for attempt in range(max_retries + 1):
        try:
            return operation()
        except _RETRYABLE_ERRORS as e:
            if attempt < max_retries:
                print(f"[supabase_client] Connection error: {e}. Resetting client and retrying (attempt {attempt + 1}/{max_retries})...")
                reset_supabase_client()
            else:
                raise
