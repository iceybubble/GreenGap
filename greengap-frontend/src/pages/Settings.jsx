import { useState } from "react";
import "./Settings.css";

export default function Settings() {
  const [apiUrl, setApiUrl] = useState("http://127.0.0.1:8000");
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem("apiUrl", apiUrl);
    localStorage.setItem("refreshInterval", refreshInterval);
    localStorage.setItem("notifications", notifications);
    localStorage.setItem("darkMode", darkMode);
    
    alert("Settings saved successfully! ✅");
  };

  return (
    <div className="settings-container">
      <h1>⚙️ Settings</h1>

      <div className="settings-section">
        <h2>🔌 API Configuration</h2>
        <div className="setting-item">
          <label>Backend API URL</label>
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="http://127.0.0.1:8000"
          />
        </div>

        <div className="setting-item">
          <label>Auto-refresh Interval (seconds)</label>
          <input
            type="number"
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(e.target.value)}
            min="10"
            max="300"
          />
        </div>
      </div>

      <div className="settings-section">
        <h2>🔔 Preferences</h2>
        
        <div className="setting-item toggle">
          <label>Enable Notifications</label>
          <div className="toggle-switch">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              id="notifications-toggle"
            />
            <label htmlFor="notifications-toggle" className="slider"></label>
          </div>
        </div>

        <div className="setting-item toggle">
          <label>Dark Mode</label>
          <div className="toggle-switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              id="darkmode-toggle"
            />
            <label htmlFor="darkmode-toggle" className="slider"></label>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2>📊 Data Management</h2>
        <button className="danger-btn">Clear Cache</button>
        <button className="danger-btn">Reset to Defaults</button>
      </div>

      <button className="save-btn" onClick={handleSave}>
        💾 Save Settings
      </button>
    </div>
  );
}