import { useEffect, useState } from "react";
import { fetchDashboard } from "../services/api";
import EmissionsChart from "../components/EmissionsChart";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard()
      .then((res) => {
        if (res?.data?.dashboard) {
          setData(res.data.dashboard);
        }
      })
      .catch((err) => {
        console.error("API ERROR:", err);
      });
  }, []);

  if (!data) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "100px" }}>
        Loading GreenGap Intelligence...
      </h2>
    );
  }

  return (
    <div className="dashboard-container">

      <div className="hero-section">
        <h1 className="hero-title">GreenGap Intelligence</h1>
        <p className="hero-subtitle">
          Detecting Rebound Effects & Hidden Climate Loss
        </p>
      </div>

      {/* SUMMARY GRID */}
      {data.summary_cards && (
        <div className="summary-grid">

          <div className="summary-card">
            <h3>Sustainability Index</h3>
            <h2>
              {Number(data.summary_cards.sustainability_index || 0).toFixed(1)}
            </h2>
          </div>

          <div className="summary-card">
            <h3>CO₂ Saved</h3>
            <h2>
              {Number(data.summary_cards.co2_saved || 0).toFixed(2)}
            </h2>
          </div>

          <div className="summary-card">
            <h3>Efficiency Score</h3>
            <h2>
              {Number(data.summary_cards.efficiency_score || 0).toFixed(1)}
            </h2>
          </div>

          <div className="summary-card">
            <h3>Behavior Score</h3>
            <h2>
              {Number(data.summary_cards.behavior_score || 0).toFixed(1)}
            </h2>
          </div>

        </div>
      )}

      {/* INTELLIGENCE SECTION */}
      <div className="intelligence-grid">

        <div className="intel-card">
          <h3>Rebound Level</h3>
          <h2
            style={{
              color:
                data.rebound_level === "HIGH"
                  ? "#ff4d4d"
                  : data.rebound_level === "MEDIUM"
                  ? "#ffaa00"
                  : "#00e676"
            }}
          >
            {data.rebound_level || "N/A"}
          </h2>
        </div>

        <div className="intel-card">
          <h3>Usage Insight</h3>
          <p>{data.behavior_insights?.behavior_reason || "No data"}</p>
        </div>

        <div className="intel-card">
          <h3>Corrected Projection</h3>
          <h2>
            {Number(data.corrected_projection || 0).toFixed(2)}
          </h2>
        </div>

      </div>

      {/* CHART */}
      {data.emissions_chart && (
        <>
          <h2 className="section-title">Emission Performance Timeline</h2>
          <EmissionsChart chartData={data.emissions_chart} />
        </>
      )}

      {/* RECOMMENDATIONS */}
      {data.recommendations && data.recommendations.length > 0 && (
        <div className="recommendation-panel">
          <h2>AI Recommendations</h2>
          <ul>
            {data.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
