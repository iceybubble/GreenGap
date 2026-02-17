import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import "./App.css";
import Home from "./pages/Home";


function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="nav-brand">
            <h2>🌱 GreenGap</h2>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/analytics" className="nav-link">Analytics</Link>
            <Link to="/settings" className="nav-link">Settings</Link>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;