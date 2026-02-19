"use client"

import React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Input } from "@/frontend/components/input"
import { useAuth } from "@/frontend/auth/AuthContext"
import { z } from "zod"

// Zod validation schema matching project spec
const signupSchema = z
  .object({
    email: z.string().email("Valid email required"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, _ and -"
      ),
    display_name: z.string().min(1, "Display name required").max(50, "Display name must be at most 50 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  })

type FieldErrors = Partial<Record<keyof z.infer<typeof signupSchema>, string>>

export function SignupContainer() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    // Client-side validation with Zod
    const result = signupSchema.safeParse({
      email,
      username,
      display_name: displayName,
      password,
      confirm_password: confirmPassword,
    })

    if (!result.success) {
      const errors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FieldErrors
        if (!errors[field]) {
          errors[field] = issue.message
        }
      }
      setFieldErrors(errors)
      return
    }

    setIsLoading(true)

    const { error } = await signUp(email, password, username, displayName)

    if (error) {
      setError(error)
      setIsLoading(false)
    } else {
      navigate("/home")
    }
  }

  async function handleGoogleSignUp() {
    setError(null)
    const { error } = await signInWithGoogle()
    if (error) {
      setError(error)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl border border-f1-card-border bg-f1-card/80 p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-wide text-foreground">
          CREATE ACCOUNT
        </h2>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="h-12 rounded-lg border-f1-card-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-f1-neon"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="h-12 rounded-lg border-f1-card-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-f1-neon"
            />
            {fieldErrors.username && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.username}</p>
            )}
          </div>

          <div>
            <Input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={isLoading}
              className="h-12 rounded-lg border-f1-card-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-f1-neon"
            />
            {fieldErrors.display_name && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.display_name}</p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="h-12 rounded-lg border-f1-card-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-f1-neon"
            />
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.password}</p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Confirm Password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              className="h-12 rounded-lg border-f1-card-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-f1-neon"
            />
            {fieldErrors.confirm_password && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.confirm_password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-full bg-f1-neon font-bold tracking-wider text-white transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-f1-neon focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                CREATING ACCOUNT...
              </span>
            ) : (
              "SIGN UP"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-[1px] flex-1 bg-f1-card-border" />
          <span className="text-sm text-muted-foreground">Or sign up with:</span>
          <div className="h-[1px] flex-1 bg-f1-card-border" />
        </div>

        {/* Google sign-up */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="flex h-12 items-center gap-3 rounded-full border border-f1-card-border bg-secondary px-8 font-medium text-foreground transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-f1-neon focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon />
            <span>Google</span>
          </button>
        </div>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {"Already have an account? "}
          <Link
            to="/login"
            className="font-medium text-f1-neon transition-colors hover:text-f1-neon/80"
          >
            {"[Login]"}
          </Link>
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  )
}
