"use client"

import { ArrowLeft, Settings } from "lucide-react"
import { Link } from "react-router-dom"

type F1HeaderVariant = "back" | "landing" | "dashboard"

interface F1HeaderProps {
  variant?: F1HeaderVariant
  backHref?: string
  username?: string
  activeNav?: string
}

export function F1Header({
  variant = "back",
  backHref = "/",
  username = "@username",
  activeNav = "Dashboard",
}: F1HeaderProps) {
  return (
    <header className="relative z-50 w-full">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - always logo for landing & dashboard, back for back */}
        {variant === "back" ? (
          <Link
            to={backHref}
            className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-f1-neon"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <F1CarIcon />
            <span className="text-lg font-bold tracking-wide text-foreground">
              F1 PREDICTIONS
            </span>
          </div>
        )}

        {/* Center logo (only for "back" variant) */}
        {variant === "back" && (
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2">
            <F1CarIcon />
            <span className="text-lg font-bold tracking-wide text-foreground">
              F1 PREDICTIONS
            </span>
          </div>
        )}

        {/* Center nav links (only for "dashboard" variant) */}
        {variant === "dashboard" && (
          <nav
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-8"
            aria-label="Main navigation"
          >
            {["Dashboard", "Predictions", "Leaderboard"].map((item) => (
              <Link
                key={item}
                to={
                  item === "Dashboard"
                    ? "/dashboard"
                    : `/${item.toLowerCase()}`
                }
                className={`text-sm font-medium transition-colors ${
                  activeNav === item
                    ? "text-f1-neon"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item}
              </Link>
            ))}
          </nav>
        )}

        {/* Right side */}
        {variant === "landing" ? (
          <nav className="flex items-center gap-3" aria-label="Auth navigation">
            <Link
              to="/login"
              className="inline-flex h-10 items-center rounded-full border border-f1-card-border bg-secondary px-6 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-f1-neon"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="inline-flex h-10 items-center rounded-full bg-f1-neon px-6 text-sm font-bold text-white transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-f1-neon"
            >
              Sign Up
            </Link>
          </nav>
        ) : variant === "dashboard" ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{username}</span>
            <button
              type="button"
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-f1-neon"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="w-16" />
        )}
      </div>

      {/* Gradient line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-f1-neon to-transparent opacity-60" />
    </header>
  )
}

function F1CarIcon() {
  return (
    <svg
      width="28"
      height="16"
      viewBox="0 0 28 16"
      fill="none"
      aria-hidden="true"
    >
      {/* Car body */}
      <path
        d="M2 10L5 6L10 4L18 3L24 4L26 7L26 10L2 10Z"
        fill="hsl(0 80% 45%)"
      />
      {/* Windshield */}
      <path d="M12 4L15 3L16 6L12 6Z" fill="hsl(210 40% 20%)" />
      {/* Front wing */}
      <path d="M24 7L27 6L28 9L26 9Z" fill="hsl(0 80% 40%)" />
      {/* Rear wing */}
      <path d="M2 6L4 3L5 6Z" fill="hsl(0 80% 40%)" />
      {/* Front wheel */}
      <circle cx="22" cy="11" r="2.5" fill="hsl(210 10% 20%)" />
      <circle cx="22" cy="11" r="1.5" fill="hsl(210 10% 35%)" />
      {/* Rear wheel */}
      <circle cx="7" cy="11" r="2.5" fill="hsl(210 10% 20%)" />
      <circle cx="7" cy="11" r="1.5" fill="hsl(210 10% 35%)" />
    </svg>
  )
}
