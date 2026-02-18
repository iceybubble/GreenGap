import { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./Dashboard.css";
import AIChat from "../components/AIChat";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/analyze");
      setData(response.data.dashboard);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 120000); // Auto-refresh every 2 minutes
    return () => clearInterval(interval);
  }, []);

  const exportToPDF = async () => {
    if (!data) {
      alert('No data available to export. Please wait for dashboard to load.');
      return;
    }
    
    try {
      const response = await fetch('http://127.0.0.1:8000/export-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dashboard: data })
      });
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GreenGap_Report_${new Date().toISOString().slice(0,10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log(' PDF exported successfully!');
    } catch (error) {
      console.error(' Export failed:', error);
      alert('Failed to export report. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading GreenGap Intelligence...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard-error">
        <p> Failed to load dashboard data</p>
        <button onClick={fetchData}>Retry</button>
      </div>
    );
  }

  const chartData = {
    labels: data.emissions_chart.labels,
    datasets: [
      {
        label: "Baseline Emissions",
        data: data.emissions_chart.baseline,
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
      },
      {
        label: "Expected (Post-Efficiency)",
        data: data.emissions_chart.expected,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
      {
        label: "Actual Emissions",
        data: data.emissions_chart.actual,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Weekly Emissions Tracking" },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: { display: true, text: "CO₂ Emissions (kg)" },
      },
    },
  };

  return (
    <div className="dashboard-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-header">
          <div>
            <h1 className="hero-title"> GreenGap Intelligence</h1>
            <p className="hero-subtitle">
              Detecting Rebound Effects & Hidden Climate Loss
            </p>
          </div>
          
          {/* Language Selector */}
          <select 
            className="language-selector"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label="Select language"
          >
            <option value="en">🇺🇸 English</option>
            <option value="es">🇪🇸 Español</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="de">🇩🇪 Deutsch</option>
            <option value="zh">🇨🇳 中文</option>
            <option value="hi">🇮🇳 हिंदी</option>
            <option value="ar">🇸🇦 العربية</option>
            <option value="pt">🇧🇷 Português</option>
          </select>
        </div>

        {/* AI Badge */}
        <div className="ai-badge-container">
          <div className="ai-badge">
            <span className="robot-icon">🤖</span>
            <span className="badge-text">Powered by Pathway AI</span>
            <span className="rag-badge">RAG</span>
          </div>
          <div className="engine-badge">
            {data.ai_engine || "Pathway RAG + Gemini"}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <h3>Sustainability Index</h3>
          <p className="card-value">{data.summary_cards.sustainability_index}</p>
          <span className="card-unit">/ 100</span>
        </div>
        <div className="card">
          <h3>CO₂ Saved</h3>
          <p className="card-value">{data.summary_cards.co2_saved}</p>
          <span className="card-unit">kg</span>
        </div>
        <div className="card">
          <h3>Efficiency Score</h3>
          <p className="card-value">{data.summary_cards.efficiency_score}</p>
          <span className="card-unit">%</span>
        </div>
        <div className="card">
          <h3>Behavior Score</h3>
          <p className="card-value">{data.summary_cards.behavior_score}</p>
          <span className="card-unit">%</span>
        </div>
      </div>

      {/* Rebound Effect Alert */}
      <div className={`rebound-alert rebound-${data.rebound_level.toLowerCase()}`}>
        <div className="alert-header">
          <h2> Rebound Effect Detected</h2>
          <span className={`rebound-badge ${data.rebound_level.toLowerCase()}`}>
            {data.rebound_level}
          </span>
        </div>
        <p className="alert-message">
          Despite efficiency improvements, actual consumption increased by{" "}
          <strong>{data.rebound_percentage}%</strong>. Your real savings are lower than
          expected.
        </p>
        <div className="alert-details">
          <div className="detail-item">
            <span className="detail-label">Expected Savings:</span>
            <span className="detail-value">{data.summary_cards.co2_saved} kg CO₂</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Corrected Projection:</span>
            <span className="detail-value corrected">
              {data.corrected_projection} kg CO₂
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <h2> Emissions Over Time</h2>
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="insights-card">
          <h2> Behavior Insights</h2>
          <p className="insight-text">{data.behavior_insights.behavior_reason}</p>
          <div className="insight-metrics">
            <div className="metric">
              <span className="metric-label">Analysis ID</span>
              <span className="metric-value">#{data.analysis_id}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Knowledge Docs</span>
              <span className="metric-value">{data.knowledge_docs_used}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="recommendations-section">
        <h2> Pathway AI Recommendations</h2>
        <ul className="recommendations-list">
          {data.recommendations.map((rec, index) => (
            <li key={index} className="recommendation-item">
              <span className="rec-number">{index + 1}</span>
              <span className="rec-text">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Floating Refresh Button */}
      <button 
        className="floating-refresh-btn" 
        onClick={fetchData}
        title="Refresh Dashboard"
        aria-label="Refresh dashboard data"
      >
        🔄
      </button>

      {/* Floating Export Button */}
      <button 
        className="floating-export-btn" 
        onClick={exportToPDF}
        title="Export PDF Report"
        aria-label="Export sustainability report as PDF"
      >
        📄
      </button>

      {/* AI CHAT ASSISTANT */}
      <AIChat language={language} />
    </div>
  );
}