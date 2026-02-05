export default function SummaryCards({ summary }) {
  if (!summary) return null;

  // ⭐ safe formatter INSIDE component
  const safe = (val) => {
    if (val === undefined || val === null) return "0";
    if (typeof val === "number") return val.toFixed(2);
    return val;
  };

  return (
    <div className="cards-grid">
      <Card title="Sustainability Index" value={safe(summary.sustainability_index)} />
      <Card title="CO₂ Saved" value={safe(summary.co2_saved)} />
      <Card title="Efficiency Score" value={safe(summary.efficiency_score)} />
      <Card title="Behavior Score" value={safe(summary.behavior_score)} />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}
