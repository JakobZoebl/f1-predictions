import { Link } from "react-router-dom"
import { useBackground } from "@/frontend/components/BackgroundContext"
import "@/frontend/styles/F1Footer.css"
import { hexToHsl } from "@/lib/utils"

interface F1FooterProps {
  primaryColor?: string
}

export function F1Footer({ primaryColor }: F1FooterProps) {
  const { config } = useBackground()

  // Calculate dynamic style if primaryColor is provided
  const footerStyle = primaryColor 
    ? (() => {
        const hsl = hexToHsl(primaryColor);
        if (hsl) {
          return { '--f1-neon': `${hsl.h} ${hsl.s}% ${hsl.l}%` } as React.CSSProperties;
        }
        return {};
      })()
    : {};

  const isTeamDriver = config.type === "team-driver"

  return (
    <footer className={`footer-container ${isTeamDriver ? "footer-team-driver" : ""}`} style={footerStyle}>
      {/* Gradient line */}
      <div className="footer-gradient-line" />

      <div className="footer-content">
        <nav className="footer-nav" aria-label="Footer navigation">
          <Link to="/impressum" className="footer-link">
            Impressum
          </Link>
        </nav>
      </div>
    </footer>
  )
}
