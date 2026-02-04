export default function SummaryCards({ summary }) {
  // Prevent crash if data not loaded yet
  if (!summary) {
    return <p>Loading summary...</p>;
  }

  return (
    <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
      <Card
        title="Sustainability Index"
        value={Number(summary.sustainability_index ?? 0).toFixed(1)}
      />
      <Card
        title="CO₂ Saved"
        value={Number(summary.co2_saved ?? 0).toFixed(2)}
      />
      <Card
        title="Efficiency Score"
        value={Number(summary.efficiency_score ?? 0).toFixed(1)}
      />
      <Card
        title="Behavior Score"
        value={summary.behavior_score ?? 0}
      />
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
