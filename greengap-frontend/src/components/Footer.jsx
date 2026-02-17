import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>🌱 GreenGap</h3>
          <p>Detecting rebound effects and hidden climate loss with AI-powered analytics.</p>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            📍 Gola Market, Srinagar Garhwal, India
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/">Dashboard</Link>
          <Link to="/analytics">Analytics</Link>
          <Link to="/settings">Settings</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-section">
          <h4>Resources</h4>
          <Link to="/docs">Documentation</Link>
          <Link to="/api">API Reference</Link>
          <a href="https://github.com/iceybubble/greengap" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
        </div>

        <div className="footer-section">
          <h4>Connect</h4>
          <a href="mailto:contact@greengap.com"> Email Us</a>
          <a href="https://x.com/maybe_priyanshi" target="_blank" rel="noopener noreferrer">
            X
          </a>
          <a href="https://www.linkedin.com/in/pallavikathait/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 GreenGap Intelligence. All rights reserved.</p>
        <p>Built with ❤️ for a sustainable future</p>
      </div>
    </footer>
  );
}