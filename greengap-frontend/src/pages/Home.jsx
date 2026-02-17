import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-landing">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-text">🌍 AI-Powered Sustainability</span>
          </div>
          <h1 className="hero-title">
            Stop Hidden Climate Loss with{" "}
            <span className="gradient-text">GreenGap Intelligence</span>
          </h1>
          <p className="hero-description">
            The world's first AI platform to detect and prevent the rebound effect—
            where energy efficiency improvements lead to increased consumption, 
            secretly undermining your climate goals.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <h3>85%</h3>
              <p>Rebound Detection Accuracy</p>
            </div>
            <div className="stat-item">
              <h3>1,247</h3>
              <p>Analyses Completed</p>
            </div>
            <div className="stat-item">
              <h3>24/7</h3>
              <p>Real-time Monitoring</p>
            </div>
          </div>
          <div className="hero-cta">
            <Link to="/dashboard" className="btn-primary">
              🚀 Launch Dashboard
            </Link>
            <Link to="/docs" className="btn-secondary">
              📚 View Documentation
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <h4>Real-time Analytics</h4>
              <p>Track every metric</p>
            </div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">🎯</div>
            <div className="card-content">
              <h4>Rebound Detection</h4>
              <p>AI-powered insights</p>
            </div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">🌱</div>
            <div className="card-content">
              <h4>CO₂ Savings</h4>
              <p>Measure your impact</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="problem-section">
        <h2>🔥 The Hidden Problem</h2>
        <div className="problem-grid">
          <div className="problem-card">
            <div className="problem-icon">⚡</div>
            <h3>The Rebound Effect</h3>
            <p>
              Companies install energy-efficient systems, but employees use them 
              more frequently, canceling out 30-80% of expected savings. This 
              invisible phenomenon costs billions in lost climate progress.
            </p>
          </div>
          <div className="problem-card">
            <div className="problem-icon">📉</div>
            <h3>Current Solutions Fail</h3>
            <p>
              Existing tools only measure consumption, not behavior. They can't 
              detect when efficiency gains are being offset by increased usage. 
              Organizations are flying blind.
            </p>
          </div>
          <div className="problem-card">
            <div className="problem-icon">💡</div>
            <h3>Our Innovation</h3>
            <p>
              GreenGap uses AI to analyze usage patterns, detect rebound effects 
              in real-time, and provide actionable recommendations before climate 
              goals are compromised.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <h2>✨ Powerful Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered Detection</h3>
            <p>Machine learning algorithms analyze behavioral patterns to identify rebound effects with 85% accuracy</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Real-time Dashboard</h3>
            <p>Live metrics update every 30 seconds with sustainability index, CO₂ savings, and efficiency scores</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Predictive Analytics</h3>
            <p>Corrected projections account for rebound effects, giving you accurate climate impact forecasts</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>Smart Recommendations</h3>
            <p>AI generates personalized, actionable suggestions to maintain efficiency gains and prevent rebound</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Responsive Design</h3>
            <p>Works seamlessly on desktop, tablet, and mobile with dark/light mode support</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔌</div>
            <h3>RESTful API</h3>
            <p>Integrate GreenGap into your existing systems with our comprehensive API</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>🔧 How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Connect Your Data</h3>
            <p>Integrate your energy monitoring systems via our API or manual uploads</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>AI Analysis</h3>
            <p>Our algorithms analyze consumption patterns, usage times, and behavioral trends</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Detect Rebound</h3>
            <p>System identifies when efficiency gains are being offset by increased usage</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Take Action</h3>
            <p>Follow AI recommendations to maintain savings and achieve climate goals</p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="use-cases">
        <h2>🏢 Perfect For</h2>
        <div className="use-case-grid">
          <div className="use-case-card">
            <h3>🏭 Enterprises</h3>
            <p>Track rebound effects across multiple facilities and departments</p>
          </div>
          <div className="use-case-card">
            <h3>🏫 Universities</h3>
            <p>Monitor campus sustainability and educate about behavioral impacts</p>
          </div>
          <div className="use-case-card">
            <h3>🏨 Hospitality</h3>
            <p>Ensure green initiatives deliver promised environmental benefits</p>
          </div>
          <div className="use-case-card">
            <h3>🏙️ Smart Cities</h3>
            <p>Analyze city-wide energy programs and prevent policy backfire</p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="impact-section">
        <h2>🌟 Our Impact</h2>
        <div className="impact-grid">
          <div className="impact-stat">
            <h3>14.9 kg</h3>
            <p>Average CO₂ Saved Per User</p>
          </div>
          <div className="impact-stat">
            <h3>30-80%</h3>
            <p>Rebound Effect Prevention</p>
          </div>
          <div className="impact-stat">
            <h3>24/7</h3>
            <p>Continuous Monitoring</p>
          </div>
          <div className="impact-stat">
            <h3>Real-time</h3>
            <p>Instant Alerts</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Close the GreenGap?</h2>
        <p>Join the fight against hidden climate loss. Start detecting rebound effects today.</p>
        <div className="cta-buttons">
          <Link to="/dashboard" className="btn-primary-large">
            🚀 Get Started Free
          </Link>
          <Link to="/contact" className="btn-secondary-large">
            📧 Contact Sales
          </Link>
        </div>
      </section>
    </div>
  );
}