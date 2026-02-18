import "./Documentation.css";

export default function Documentation() {
  return (
    <div className="docs-container">
      <aside className="docs-sidebar">
        <h3>📚 Contents</h3>
        <nav>
          <a href="#getting-started">Getting Started</a>
          <a href="#features">Features</a>
          <a href="#dashboard">Dashboard Guide</a>
          <a href="#analytics">Analytics</a>
          <a href="#rebound-detection">Rebound Detection</a>
          <a href="#api-integration">API Integration</a>
          <a href="#troubleshooting">Troubleshooting</a>
        </nav>
      </aside>

      <main className="docs-content">
        <h1>📖 GreenGap Documentation</h1>
        <p className="docs-intro">
          Welcome to the GreenGap Intelligence documentation. This guide will help you understand 
          and make the most of our AI-powered sustainability analytics platform.
        </p>

        <section id="getting-started">
          <h2>🚀 Getting Started</h2>
          <p>
            GreenGap is an advanced platform designed to detect rebound effects in energy consumption 
            and help organizations maintain their sustainability goals.
          </p>
          
          <h3>What is the Rebound Effect?</h3>
          <p>
            The rebound effect occurs when energy efficiency improvements lead to increased consumption, 
            offsetting the expected savings. For example, installing energy-efficient appliances might 
            lead users to use them more frequently, reducing the overall benefit.
          </p>

          <div className="code-block">
            <h4>Quick Start</h4>
            <pre>
{`1. Navigate to the Dashboard
2. Review your Sustainability Index
3. Check Rebound Level indicators
4. Follow AI Recommendations
5. Monitor Emission Timeline`}
            </pre>
          </div>
        </section>

        <section id=" mfeatures">
          <h2>✨ Key Features</h2>
          
          <div className="feature-grid">
            <div className="feature-item">
              <h4>📊 Sustainability Index</h4>
              <p>A composite score (0-100) reflecting your overall environmental performance</p>
            </div>

            <div className="feature-item">
              <h4>🌱 CO₂ Tracking</h4>
              <p>Real-time monitoring of carbon dioxide saved compared to baseline</p>
            </div>

            <div className="feature-item">
              <h4>⚡ Efficiency Score</h4>
              <p>Measures how effectively energy is being used</p>
            </div>

            <div className="feature-item">
              <h4>👤 Behavior Analysis</h4>
              <p>AI-powered insights into usage patterns and habits</p>
            </div>
          </div>
        </section>

        <section id="dashboard">
          <h2>📱 Dashboard Guide</h2>
          
          <h3>Summary Cards</h3>
          <p>The dashboard displays four key metrics:</p>
          <ul className="docs-list">
            <li><strong>Sustainability Index:</strong> Overall environmental performance score</li>
            <li><strong>CO₂ Saved:</strong> Total carbon emissions reduced (in kg)</li>
            <li><strong>Efficiency Score:</strong> Energy usage effectiveness (percentage)</li>
            <li><strong>Behavior Score:</strong> User habit quality rating</li>
          </ul>

          <h3>Intelligence Section</h3>
          <ul className="docs-list">
            <li><strong>Rebound Level:</strong> LOW, MEDIUM, or HIGH - indicates severity of rebound effects</li>
            <li><strong>Usage Insight:</strong> Detailed explanation of behavioral patterns</li>
            <li><strong>Corrected Projection:</strong> Adjusted CO₂ forecast accounting for rebound</li>
          </ul>
        </section>

        <section id="analytics">
          <h2>📈 Analytics</h2>
          <p>
            The Analytics page provides deeper insights with time-range analysis (7, 30, or 90 days).
          </p>

          <h3>Metrics Available:</h3>
          <ul className="docs-list">
            <li>Rebound Detection Rate - Percentage of efficiency gains lost to rebound</li>
            <li>Potential Savings - Estimated value of carbon credits</li>
            <li>Data Quality Score - Confidence level in predictions</li>
            <li>Total Analyses - Historical analysis count</li>
          </ul>
        </section>

        <section id="rebound-detection">
          <h2>🎯 Rebound Detection Algorithm</h2>
          <p>
            Our AI model analyzes multiple factors to detect rebound effects:
          </p>

          <div className="code-block">
            <h4>Detection Factors</h4>
            <pre>
{`1. Baseline Consumption Patterns
2. Post-Efficiency Implementation Usage
3. Time-of-Day Analysis
4. Seasonal Adjustments
5. Behavioral Trend Correlation
6. External Factor Normalization`}
            </pre>
          </div>

          <h3>Rebound Level Classification</h3>
          <ul className="docs-list">
            <li><strong className="text-danger">HIGH (Red):</strong> &gt;70% efficiency gains lost to increased usage</li>
            <li><strong className="text-warning">MEDIUM (Orange):</strong> 30-70% efficiency gains offset</li>
            <li><strong className="text-success">LOW (Green):</strong> &lt;30% rebound effect detected</li>
          </ul>
        </section>

        <section id="api-integration">
          <h2>🔌 API Integration</h2>
          <p>
            GreenGap provides a RESTful API for programmatic access to analytics data.
          </p>
          <p>
            <Link to="/api" className="link-button">View API Reference →</Link>
          </p>
        </section>

        <section id="troubleshooting">
          <h2>🛠️ Troubleshooting</h2>
          
          <h3>Common Issues</h3>
          
          <div className="troubleshooting-item">
            <h4>Q: Data not refreshing?</h4>
            <p>A: Click the floating refresh button (🔄) in the bottom-right corner or wait for the automatic 30-second refresh cycle.</p>
          </div>

          <div className="troubleshooting-item">
            <h4>Q: Metrics showing zero?</h4>
            <p>A: Ensure your backend API is running and accessible. Check Settings → API Configuration.</p>
          </div>

          <div className="troubleshooting-item">
            <h4>Q: How often should I check my dashboard?</h4>
            <p>A: We recommend daily monitoring for optimal rebound effect detection and timely intervention.</p>
          </div>
        </section>

        <section className="docs-footer-section">
          <h2>💬 Need Help?</h2>
          <p>
            Can't find what you're looking for? 
            <Link to="/contact"> Contact our support team</Link> for personalized assistance.
          </p>
        </section>
      </main>
    </div>
  );
}