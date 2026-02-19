"""
Shared Supabase client initialization.

Provides a singleton Supabase client using the service role key
for server-side operations. Used by all API endpoints.

Environment variables required:
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
"""

import os
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
