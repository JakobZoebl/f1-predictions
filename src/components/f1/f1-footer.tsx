import { Link } from "react-router-dom"

export function F1Footer() {
  return (
    <footer className="mt-auto w-full">
      {/* Gradient line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-f1-neon to-transparent opacity-30" />

      <div className="flex flex-col items-center gap-4 px-6 py-6 md:flex-row md:justify-between">
        <p className="text-xs text-muted-foreground">
          {"F1 Predictions. All rights reserved."}
        </p>

        <nav className="flex items-center gap-6" aria-label="Footer navigation">
          <Link
            to="/terms"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Terms
          </Link>
          <Link
            to="/privacy"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy
          </Link>
          <Link
            to="/contact"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  )
}
