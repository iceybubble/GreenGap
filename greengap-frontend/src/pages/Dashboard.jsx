import { useEffect, useState } from "react";
import { fetchDashboard } from "../services/api";
import EmissionsChart from "../components/EmissionsChart";
import AIChat from "../components/AIChat";
import "./Dashboard.css";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRec, setExpandedRec] = useState(null);

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
    const interval = setInterval(loadData, 120000); // 2 minutes (120 seconds)
    return () => clearInterval(interval);
  }, []);

  // Expanded recommendation details
  const getExpandedRecommendation = (index) => {
    const details = [
      "High rebound detected: Your energy efficiency improvements have led to increased usage duration. Consider setting automated schedules to limit usage during peak hours. Implement smart timers and usage caps to maintain the benefits of your efficiency upgrades.",
      "Set smart usage schedules to prevent overconsumption. Create automated routines that turn off devices during non-essential hours. Use energy monitoring apps to track consumption patterns and identify optimization opportunities.",
      "Monitor your consumption patterns weekly and adjust habits accordingly. Set up alerts for unusual usage spikes. Review your energy dashboard regularly to stay aware of your carbon footprint trends.",
      "Consider renewable energy sources to offset your carbon footprint. Look into solar panels, wind energy subscriptions, or carbon offset programs. Even small changes like switching to green energy providers can make a significant impact."
    ];
    return details[index] || details[0];
  };

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

  // Ensure at least 2 recommendations
  const recommendations = data.recommendations && data.recommendations.length >= 2 
    ? data.recommendations 
    : [
        "High rebound detected: reduce usage duration after efficiency adoption.",
        "Set smart usage schedules to prevent overconsumption.",
        "Monitor your consumption patterns weekly and adjust habits accordingly.",
        "Consider renewable energy sources to offset your carbon footprint."
      ];

  return (
    <div className="dashboard-container">
      {/* Floating Refresh Button */}
      <button 
        className="floating-refresh-btn" 
        onClick={loadData}
        title="Refresh Data"
        aria-label="Refresh dashboard data"
      >
        🔄
      </button>

      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">🌍 GreenGap Intelligence</h1>
        <p className="hero-subtitle">
          Detecting Rebound Effects & Hidden Climate Loss
        </p>
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

      {/* 🔥 AI POWERED BADGE - NEW! */}
      {/* AI Powered Badge */}
{data?.rag_enabled && (
  <div className="ai-badge-container">
    <div className="ai-badge">
      
      <span className="ai-text">Powered by Pathway AI</span>
      <span className="rag-badge">RAG</span>
    </div>
  </div>
)}

      {/* Chart */}
      {data.emissions_chart && (
        <div className="chart-section">
          <h2 className="section-title">📊 Emission Performance Timeline</h2>
          <EmissionsChart chartData={data.emissions_chart} />
        </div>
      )}

      {/* Recommendations with Expand/Collapse */}
      {recommendations.length > 0 && (
        <div className="recommendation-panel">
          <h2>
            🤖 Pathway AI Recommendations
            {data?.ai_engine && (
              <span className="engine-badge">{data.ai_engine}</span>
            )}
          </h2>
          <ul className="recommendation-list">
            {recommendations.map((rec, i) => (
              <li 
                key={i} 
                className={`recommendation-item ${expandedRec === i ? 'expanded' : ''}`}
                onClick={() => setExpandedRec(expandedRec === i ? null : i)}
              >
                <span className="rec-number">{i + 1}</span>
                <div className="rec-content">
                  <span className="rec-short">{rec}</span>
                  {expandedRec === i && (
                    <p className="rec-expanded">{getExpandedRecommendation(i)}</p>
                  )}
                  <span className="rec-toggle">
                    {expandedRec === i ? '▲ Show less' : '▼ Read more'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI CHAT ASSISTANT - NEW! */}
      <AIChat />
    </div>
  );
}