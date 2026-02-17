import { useState } from "react";
import "./APIReference.css";

export default function APIReference() {
  const [selectedEndpoint, setSelectedEndpoint] = useState("analyze");

  const endpoints = {
    analyze: {
      method: "GET",
      path: "/analyze",
      description: "Get comprehensive dashboard analytics including rebound detection, emissions data, and AI recommendations.",
      response: `{
  "dashboard": {
    "summary_cards": {
      "sustainability_index": 62.0,
      "co2_saved": 14.94,
      "efficiency_score": 50.0,
      "behavior_score": 80.0
    },
    "rebound_level": "MEDIUM",
    "corrected_projection": 12.5,
    "behavior_insights": {
      "behavior_reason": "High usage detected during peak hours"
    },
    "emissions_chart": {
      "labels": ["Mon", "Tue", "Wed", "Thu", "Fri"],
      "baseline": [100, 102, 98, 105, 103],
      "expected": [80, 82, 78, 85, 83],
      "actual": [90, 92, 88, 95, 93]
    },
    "recommendations": [
      "Reduce usage during peak hours",
      "Implement automated scheduling"
    ]
  }
}`
    },
    health: {
      method: "GET",
      path: "/",
      description: "Health check endpoint to verify API status.",
      response: `{
  "message": "GreenGap backend running"
}`
    }
  };

  const currentEndpoint = endpoints[selectedEndpoint];

  return (
    <div className="api-container">
      <div className="api-header">
        <h1>🔌 API Reference</h1>
        <p>RESTful API for GreenGap Intelligence Platform</p>
      </div>

      <div className="api-content">
        <aside className="api-sidebar">
          <h3>Endpoints</h3>
          <button 
            className={selectedEndpoint === "analyze" ? "active" : ""}
            onClick={() => setSelectedEndpoint("analyze")}
          >
            <span className="method get">GET</span> /analyze
          </button>
          <button 
            className={selectedEndpoint === "health" ? "active" : ""}
            onClick={() => setSelectedEndpoint("health")}
          >
            <span className="method get">GET</span> /
          </button>
        </aside>

        <main className="api-main">
          <div className="endpoint-header">
            <span className={`method ${currentEndpoint.method.toLowerCase()}`}>
              {currentEndpoint.method}
            </span>
            <h2>{currentEndpoint.path}</h2>
          </div>

          <p className="endpoint-description">{currentEndpoint.description}</p>

          <section className="api-section">
            <h3>Base URL</h3>
            <div className="code-block">
              <code>http://127.0.0.1:8000</code>
            </div>
          </section>

          <section className="api-section">
            <h3>Example Request</h3>
            <div className="code-block">
              <pre>{`curl -X ${currentEndpoint.method} \\
  http://127.0.0.1:8000${currentEndpoint.path} \\
  -H "Content-Type: application/json"`}</pre>
            </div>
          </section>

          <section className="api-section">
            <h3>Response</h3>
            <div className="code-block">
              <pre>{currentEndpoint.response}</pre>
            </div>
          </section>

          {selectedEndpoint === "analyze" && (
            <section className="api-section">
              <h3>Response Fields</h3>
              <table className="fields-table">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>sustainability_index</code></td>
                    <td>float</td>
                    <td>Overall environmental performance score (0-100)</td>
                  </tr>
                  <tr>
                    <td><code>co2_saved</code></td>
                    <td>float</td>
                    <td>Carbon dioxide saved in kilograms</td>
                  </tr>
                  <tr>
                    <td><code>efficiency_score</code></td>
                    <td>float</td>
                    <td>Energy efficiency percentage (0-100)</td>
                  </tr>
                  <tr>
                    <td><code>behavior_score</code></td>
                    <td>float</td>
                    <td>User behavior quality rating (0-100)</td>
                  </tr>
                  <tr>
                    <td><code>rebound_level</code></td>
                    <td>string</td>
                    <td>Rebound effect severity: LOW, MEDIUM, or HIGH</td>
                  </tr>
                  <tr>
                    <td><code>corrected_projection</code></td>
                    <td>float</td>
                    <td>Adjusted CO₂ forecast accounting for rebound</td>
                  </tr>
                  <tr>
                    <td><code>recommendations</code></td>
                    <td>array</td>
                    <td>AI-generated actionable suggestions</td>
                  </tr>
                </tbody>
              </table>
            </section>
          )}

          <section className="api-section">
            <h3>Rate Limiting</h3>
            <p>Currently no rate limiting is enforced. For production use, implement appropriate rate limiting based on your infrastructure.</p>
          </section>

          <section className="api-section">
            <h3>Error Responses</h3>
            <div className="code-block">
              <pre>{`{
  "error": "Error message description",
  "status": 500
}`}</pre>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}