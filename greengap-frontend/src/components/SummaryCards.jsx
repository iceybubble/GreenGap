export default function SummaryCards({ summary }) {
  if (!summary) {
    return <p>Loading summary...</p>;
  }

  return (
    <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
      <Card title="Sustainability Index" value={safe(summary.sustainability_index)} />
      <Card title="CO₂ Saved" value={safe(summary.co2_saved)} />
      <Card title="Efficiency Score" value={safe(summary.efficiency_score)} />
      <Card title="Behavior Score" value={safe(summary.behavior_score)} />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        padding: "20px",
        background: "#111",
        color: "white",
        borderRadius: "12px",
        width: "200px",
        textAlign: "center",
      }}
    >
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}

// crash-proof number formatter
function safe(val) {
  if (val === undefined || val === null) return "0";
  if (typeof val === "number") return val.toFixed(2);
  return val;
}
