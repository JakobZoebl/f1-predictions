import { Settings } from "lucide-react"
import { F1Header } from "@/components/f1/f1-header"
import "@/styles/TestPage.css"

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
      <div className="test-page-container">
        <h1 className="test-page-title">Template Canvas</h1>
        <div className="test-page-card">
          <p className="test-page-description">
            This is the template canvas for future implementations.
          </p>
          {/* Add components here to test them */}
        </div>
      </div>
    </main>
  )
}
