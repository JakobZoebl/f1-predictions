import { Link } from "react-router-dom"
import "@/frontend/styles/F1Footer.css"
import { hexToHsl } from "@/lib/utils"

interface F1FooterProps {
  primaryColor?: string
}

export function F1Footer({ primaryColor }: F1FooterProps) {
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

  return (
    <footer className="footer-container" style={footerStyle}>
      {/* Gradient line */}
      <div className="footer-gradient-line" />

      <div className="footer-content">
        <p className="footer-copyright">
          {"F1 Predictions. All rights reserved."}
        </p>

        <nav className="footer-nav" aria-label="Footer navigation">
          <Link to="/terms" className="footer-link">
            Terms
          </Link>
          <Link to="/privacy" className="footer-link">
            Privacy
          </Link>
          <Link to="/contact" className="footer-link">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  )
}
