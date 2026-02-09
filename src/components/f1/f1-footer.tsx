import { Link } from "react-router-dom"
import "@/styles/F1Footer.css"

export function F1Footer() {
  return (
    <footer className="footer-container">
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
