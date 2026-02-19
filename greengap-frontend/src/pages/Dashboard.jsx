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
  // Use environment variable or fallback to deployed backend
  const API_URL = import.meta.env.VITE_API_URL || "https://greengap-backend.onrender.com";
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');

  const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await axios.get(`${API_URL}/analyze`, {
      timeout: 10000, // 10 second timeout
    });
    setData(response.data.dashboard);
    setLoading(false);
  } catch (error) {
    console.error(" Backend unavailable, using demo data:", error);
    
    // FALLBACK: Use mock data if backend is down
    const mockData = {
      analysis_id: "DEMO-" + Date.now(),
      sustainability_index: 74.7,
      rebound_level: "MEDIUM",
      rebound_percentage: 53,
      corrected_projection: 127,
      ai_engine: "Demo Mode (Backend Offline)",
      knowledge_docs_used: 10,
      
      summary_cards: {
        sustainability_index: "74.7",
        co2_saved: "245",
        efficiency_score: "87.1",
        behavior_score: "78.1"
      },
      
      emissions_chart: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        baseline: [450, 445, 440, 435],
        expected: [315, 312, 308, 305],
        actual: [375, 370, 368, 365]
      },
      
      behavior_insights: {
        behavior_reason: " DEMO MODE: Backend is temporarily unavailable. This is sample data showing how rebound effects occur when efficient devices are used more frequently, negating 40-70% of expected savings. In production, this would show your real-time sustainability analysis powered by Pathway RAG + Google Gemini 2.5."
      },
      
      recommendations: [
        " DEMO MODE ACTIVE - Backend is sleeping or unavailable",
        " In production: Implement automated scheduling to prevent rebound effects",
        " In production: Deploy smart thermostats for 30-40% energy reduction",
        " In production: Launch gamification program to improve behavior scores by 10-15 points",
        " In production: Shift 20-30% of consumption to off-peak hours for cost savings",
        " This demo data shows full platform capabilities - backend will restore automatically"
      ]
    };
    
    setData(mockData);
    setError(" Using demo data - backend is sleeping (Render free tier spins down after 15min inactivity)");
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
      const response = await fetch(`${API_URL}/export-report`, {
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
      
      console.log('PDF exported successfully!');
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
        <p className="loading-subtext">Connecting to Pathway AI + Gemini...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="dashboard-error">
        <p>Failed to load dashboard data</p>
        {error && <p className="error-details">{error}</p>}
        <p className="error-hint">
          Backend URL: {API_URL}
          <br />
          Note: Free tier backends may take 30-60 seconds to wake up on first request.
        </p>
        <button onClick={fetchData} className="retry-button"> Retry Connection</button>
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

  const wakeBackend = async () => {
  setLoading(true);
  setError(" Waking up backend... This may take 30-60 seconds...");
  
  try {
    const response = await axios.get(`${API_URL}/health`, { 
      timeout: 90000 // 90 second timeout for wake-up
    });
    
    if (response.data.status === "healthy") {
      setError(null);
      alert(" Backend is awake! Refreshing dashboard...");
      fetchData(); // Refresh with real data
    }
  } catch (error) {
    setError(" Backend is still waking up. Wait 30 seconds and click 'Refresh Dashboard' again.");
    setLoading(false);
  }
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
          <h2>⚠️ Rebound Effect Detected</h2>
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
          <h2>📈 Emissions Over Time</h2>
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="insights-card">
          <h2>💡 Behavior Insights</h2>
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
        <h2>🤖 Pathway AI Recommendations</h2>
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
      <AIChat language={language} apiUrl={API_URL} />
    </div>
  );
}