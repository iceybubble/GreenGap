export default function Recommendations({ data }) {
  if (!data) return null;

  return (
    <div
      style={{
        marginTop: "40px",
        padding: "20px",
        background: "#0f172a",
        color: "white",
        borderRadius: "12px",
      }}
    >
      <h2>GreenGap Recommendations</h2>

      <p><strong>Rebound Level:</strong> {data.rebound_level}</p>

      <ul>
        {data.recommendations.map((rec, i) => (
          <li key={i}>{rec}</li>
        ))}
      </ul>

      <p>
        <strong>Corrected Emission Projection:</strong>{" "}
        {Number(data.corrected_projection).toFixed(2)}
      </p>
    </div>
  );
}
