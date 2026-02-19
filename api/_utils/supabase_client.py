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


def get_supabase_client() -> Client:
    """
    Create and return a Supabase client using service role credentials.
    
    Returns:
        Client: Authenticated Supabase client instance.
    
    Raises:
        ValueError: If required environment variables are not set.
    """
    # TODO: Initialize Supabase client from env vars
    # TODO: Consider caching/reusing the client across invocations
    pass
