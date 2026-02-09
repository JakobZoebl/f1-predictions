"use client"

import React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"

export function SignupContainer() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl border border-f1-card-border bg-f1-card/80 p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-wide text-foreground">
          CREATE ACCOUNT
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-lg border-f1-card-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-f1-neon"
          />

          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-12 rounded-lg border-f1-card-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-f1-neon"
          />

          <Input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="h-12 rounded-lg border-f1-card-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-f1-neon"
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-lg border-f1-card-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-f1-neon"
          />

          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-12 rounded-lg border-f1-card-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-f1-neon"
          />

          <button
            type="submit"
            className="h-12 w-full rounded-full bg-f1-neon font-bold tracking-wider text-white transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-f1-neon focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            SIGN UP
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
            className="flex h-12 items-center gap-3 rounded-full border border-f1-card-border bg-secondary px-8 font-medium text-foreground transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-f1-neon focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
