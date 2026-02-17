import { useEffect, useState } from "react";
import { fetchDashboard } from "../services/api";
import EmissionsChart from "../components/EmissionsChart";
import "./Dashboard.css";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDashboard();
      if (res?.data?.dashboard) {
        setData(res.data.dashboard);
      } else {
        setData(res.data);
      }
    } catch (err) {
      console.error("API ERROR:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h2 style={{ marginTop: "1rem" }}>Loading GreenGap Intelligence...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>⚠️ Error Loading Data</h2>
        <p>{error}</p>
        <button onClick={loadData}>Retry</button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="loading-container">
        <h2>No data available</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">🌍 GreenGap Intelligence</h1>
        <p className="hero-subtitle">
          Detecting Rebound Effects & Hidden Climate Loss
        </p>
        <button className="refresh-btn" onClick={loadData}>
          🔄 Refresh Data
        </button>
      </div>

      {/* Summary Grid */}
      {data.summary_cards && (
        <div className="summary-grid">
          <div className="summary-card sustainability">
            <div className="card-icon">📊</div>
            <h3>Sustainability Index</h3>
            <h2>{Number(data.summary_cards.sustainability_index || 0).toFixed(1)}</h2>
          </div>

          <div className="summary-card co2">
            <div className="card-icon">🌱</div>
            <h3>CO₂ Saved</h3>
            <h2>{Number(data.summary_cards.co2_saved || 0).toFixed(2)} kg</h2>
          </div>

          <div className="summary-card efficiency">
            <div className="card-icon">⚡</div>
            <h3>Efficiency Score</h3>
            <h2>{Number(data.summary_cards.efficiency_score || 0).toFixed(1)}%</h2>
          </div>

          <div className="summary-card behavior">
            <div className="card-icon">👤</div>
            <h3>Behavior Score</h3>
            <h2>{Number(data.summary_cards.behavior_score || 0).toFixed(1)}%</h2>
          </div>
        </div>
      )}

      {/* Intelligence Section */}
      <div className="intelligence-grid">
        <div className="intel-card">
          <h3>🎯 Rebound Level</h3>
          <h2 className={`rebound-level ${data.rebound_level?.toLowerCase()}`}>
            {data.rebound_level || "N/A"}
          </h2>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: data.rebound_level === "HIGH" ? "90%" : 
                       data.rebound_level === "MEDIUM" ? "50%" : "20%"
              }}
            ></div>
          </div>
        </div>

        <div className="intel-card">
          <h3>💡 Usage Insight</h3>
          <p className="insight-text">
            {data.behavior_insights?.behavior_reason || "No data available"}
          </p>
        </div>

        <div className="intel-card">
          <h3>📈 Corrected Projection</h3>
          <h2>{Number(data.corrected_projection || 0).toFixed(2)} kg CO₂</h2>
        </div>
      </div>

      {/* Chart */}
      {data.emissions_chart && (
        <div className="chart-section">
          <h2 className="section-title">📊 Emission Performance Timeline</h2>
          <EmissionsChart chartData={data.emissions_chart} />
        </div>
      )}

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <div className="recommendation-panel">
          <h2>🤖 AI Recommendations</h2>
          <ul className="recommendation-list">
            {data.recommendations.map((rec, i) => (
              <li key={i} className="recommendation-item">
                <span className="rec-number">{i + 1}</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}