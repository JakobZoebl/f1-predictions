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

  /**
   * For OAuth users (Google), ensure a profile row exists in the users table.
   * If not, create one using the Google display name as username.
   */
  async function ensureUserProfile(authUser: User) {
    try {
      const { data: existingProfile } = await supabase
        .from("users")
        .select("id")
        .eq("id", authUser.id)
        .maybeSingle()

      if (!existingProfile) {
        const googleName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || "User"
        const baseUsername = googleName.toLowerCase().replace(/[^a-z0-9_-]/g, "_").slice(0, 25)
        const uniqueUsername = `${baseUsername}_${Date.now().toString(36).slice(-4)}`

        await supabase.from("users").insert({
          id: authUser.id,
          username: uniqueUsername,
          display_name: googleName,
          favorite_team_id: "redbull",
          favorite_driver_id: "verstappen",
        })
      }
    } catch {
      console.warn("Could not ensure user profile, may already exist.")
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // On first OAuth sign-in, create user profile if it doesn't exist
        if (event === "SIGNED_IN" && session?.user) {
          const { user } = session
          const provider = user.app_metadata?.provider

          if (provider === "google") {
            await ensureUserProfile(user)
          }
        }
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
      // Check username uniqueness first
      // Use .maybeSingle() instead of .single() to avoid 406 when no rows found
      const { data: existing, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("username", username)
        .maybeSingle()

      if (checkError) {
        console.error("Username check error:", checkError)
        return { error: "Could not verify username availability. Please try again." }
      }

      if (existing) {
        return { error: "Username is already taken." }
      }

      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: displayName,
            favorite_team_id: favoriteTeamId,
            favorite_driver_id: favoriteDriverId,
          },
        },
      })

      if (error) {
        return { error: error.message }
      }

      if (!data.user) {
        return { error: "Failed to create account." }
      }

      // If signUp didn't return a session, sign in to establish one
      if (!data.session) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) {
          return { error: "Account created, but could not sign in automatically. Please log in manually." }
        }
      }

      // Now we have a session — create the profile row
      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        username,
        display_name: displayName,
        favorite_team_id: favoriteTeamId,
        favorite_driver_id: favoriteDriverId,
      })

      if (profileError) {
        console.error("Profile creation error:", profileError)
        return { error: "Account created but profile setup failed. Please contact support." }
      }

      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : "An unexpected error occurred." }
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
