"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabaseClient"

/**
 * Handles the OAuth callback redirect from Google sign-in.
 * Processes the auth tokens in the URL hash and redirects
 * to /home on success or /login on failure.
 */
export function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase automatically handles the hash fragment
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          setError(error.message)
          setTimeout(() => navigate("/login"), 3000)
          return
        }

        if (session) {
          navigate("/home")
        } else {
          setError("Authentication failed. Please try again.")
          setTimeout(() => navigate("/login"), 3000)
        }
      } catch {
        setError("Something went wrong. Redirecting to login...")
        setTimeout(() => navigate("/login"), 3000)
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        {error ? (
          <>
            <div className="mb-4 text-lg text-red-400">{error}</div>
            <p className="text-sm text-muted-foreground">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="mb-4 h-8 w-8 mx-auto animate-spin rounded-full border-2 border-f1-neon border-t-transparent" />
            <p className="text-muted-foreground">Completing sign-in...</p>
          </>
        )}
      </div>
    </div>
  )
}
