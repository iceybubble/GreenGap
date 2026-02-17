import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import { useTheme } from "./context/ThemeContext";
import "./App.css";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Router>
      <div className="app-container">
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="nav-brand">
            <h2>GreenGap</h2>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/analytics" className="nav-link">Analytics</Link>
            <Link to="/settings" className="nav-link">Settings</Link>
            
            {/* Theme Toggle Button */}
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;