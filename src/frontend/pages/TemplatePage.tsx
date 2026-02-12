import { Settings } from "lucide-react"
import { F1Header } from "@/frontend/components/f1-header"

export default function TemplatePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <F1Header variant="dashboard" activeNav="Template">
        <div className="header-right-nav">
          <span className="header-username">@username</span>
          <button
            type="button"
            className="header-settings-btn"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </F1Header>
      <div className="container mx-auto py-10">
        <h1 className="mb-6 text-3xl font-bold font-display">Template Canvas</h1>
        <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
          <p className="text-muted-foreground">
            This is the template canvas for future implementations.
          </p>
          {/* Add components here to test them */}
        </div>
      </div>
    </main>
  )
}
