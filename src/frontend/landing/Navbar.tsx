import { Button } from "@/frontend/components/button"

function RaceCarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Body */}
      <path
        d="M2 13h3l2-4h6l3-3h8l4 3h2v4H2v-1z"
        fill="currentColor"
        opacity="0.9"
      />
      {/* Nose / front wing */}
      <path d="M0 14h4l1-2H1z" fill="currentColor" />
      {/* Rear wing */}
      <rect x="26" y="5" width="5" height="2" rx="0.5" fill="currentColor" />
      <rect x="28" y="7" width="1" height="4" fill="currentColor" />
      {/* Front wheel */}
      <circle cx="8" cy="15" r="3" fill="currentColor" opacity="0.85" />
      <circle cx="8" cy="15" r="1.3" fill="hsl(var(--background))" />
      {/* Rear wheel */}
      <circle cx="24" cy="15" r="3" fill="currentColor" opacity="0.85" />
      <circle cx="24" cy="15" r="1.3" fill="hsl(var(--background))" />
      {/* Cockpit */}
      <path d="M14 9l1.5-2h3L20 9z" fill="hsl(var(--primary))" opacity="0.7" />
    </svg>
  )
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2.5">
          <RaceCarIcon className="h-5 w-8 text-accent" />
          <span className="font-display text-lg font-bold tracking-wide text-foreground">
            F1 <span className="font-bold">PREDICTIONS</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-full border-primary/40 bg-transparent px-6 text-foreground hover:border-primary/70 hover:bg-primary/10 hover:text-foreground"
          >
            Login
          </Button>
          <Button className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90">
            Sign Up
          </Button>
        </div>
      </nav>
    </header>
  )
}
