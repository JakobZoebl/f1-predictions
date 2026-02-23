"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabaseClient"
import type { User, Session } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, username: string, displayName: string, favoriteTeamId?: string, favoriteDriverId?: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signInWithGoogle: () => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signUp = useCallback(async (
    email: string,
    password: string,
    username: string,
    displayName: string,
    favoriteTeamId: string = "redbull",
    favoriteDriverId: string = "verstappen"
  ): Promise<{ error: string | null }> => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          username,
          display_name: displayName,
          favorite_team_id: favoriteTeamId,
          favorite_driver_id: favoriteDriverId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || "Failed to create account." };
      }

      // Automatically sign in after successful account creation
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        return { error: "Account created, but could not sign in automatically. Please log in manually." };
      }

      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : "An unexpected error occurred." };
    }
  }, [])

  const signIn = useCallback(async (
    email: string,
    password: string
  ): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          return { error: "Email or password is incorrect." }
        }
        return { error: error.message }
      }

      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : "An unexpected error occurred." }
    }
  }, [])

  const signInWithGoogle = useCallback(async (): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : "An unexpected error occurred." }
    }
  }, [])

  const signOutFn = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut: signOutFn,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
