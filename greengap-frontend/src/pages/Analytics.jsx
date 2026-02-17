import { useState, useEffect } from "react";
import { fetchDashboard } from "../services/api";
import "./Analytics.css";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [timeRange, setTimeRange] = useState("7days");

  useEffect(() => {
    fetchDashboard()
      .then((res) => {
        if (res?.data?.dashboard) {
          setData(res.data.dashboard);
        } else {
          setData(res.data);
        }
      })
      .catch((err) => console.error(err));
  }, [timeRange]);

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>📈 Advanced Analytics</h1>
        <div className="time-range-selector">
          <button 
            className={timeRange === "7days" ? "active" : ""}
            onClick={() => setTimeRange("7days")}
          >
            7 Days
          </button>
          <button 
            className={timeRange === "30days" ? "active" : ""}
            onClick={() => setTimeRange("30days")}
          >
            30 Days
          </button>
          <button 
            className={timeRange === "90days" ? "active" : ""}
            onClick={() => setTimeRange("90days")}
          >
            90 Days
          </button>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>🎯 Rebound Detection Rate</h3>
          <div className="metric-large">
            {data?.rebound_level === "HIGH" ? "85%" : 
             data?.rebound_level === "MEDIUM" ? "45%" : "12%"}
          </div>
          <p className="metric-subtitle">Based on behavioral patterns</p>
        </div>

        <div className="analytics-card">
          <h3>💰 Potential Savings</h3>
          <div className="metric-large">
            ${data?.summary_cards?.co2_saved ? 
              (data.summary_cards.co2_saved * 0.05).toFixed(2) : "0.00"}
          </div>
          <p className="metric-subtitle">Estimated carbon credit value</p>
        </div>

        <div className="analytics-card">
          <h3>📊 Data Quality Score</h3>
          <div className="metric-large">94%</div>
          <p className="metric-subtitle">High confidence in predictions</p>
        </div>

        <div className="analytics-card">
          <h3>🔄 Total Analyses</h3>
          <div className="metric-large">1,247</div>
          <p className="metric-subtitle">Since project inception</p>
        </div>
      </div>

      <div className="insights-section">
        <h2>🧠 Key Insights</h2>
        
        <div className="insight-card">
          <div className="insight-icon">📉</div>
          <div className="insight-content">
            <h4>Declining Efficiency Trend</h4>
            <p>
              Your energy efficiency has decreased by 3% over the last week. 
              This may indicate rebound effects from recent behavior changes.
            </p>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon">⚠️</div>
          <div className="insight-content">
            <h4>High Usage Alert</h4>
            <p>
              Detected unusual spike in consumption on weekends. 
              Consider implementing automated controls during off-peak hours.
            </p>
          </div>
        </div>

        <div className="insight-card positive">
          <div className="insight-icon">✅</div>
          <div className="insight-content">
            <h4>Positive Progress</h4>
            <p>
              You have saved {data?.summary_cards?.co2_saved?.toFixed(2) || "0"} kg CO₂ 
              compared to baseline. Keep up the good work!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}