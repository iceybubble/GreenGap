import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function EmissionsChart({ chartData }) {
  // SAFETY CHECK — prevents React crash
  if (
    !chartData ||
    !chartData.labels ||
    !chartData.baseline ||
    !chartData.expected ||
    !chartData.actual
  ) {
    return <p>Preparing emissions chart...</p>;
  }

  const formatted = chartData.labels.map((label, index) => ({
    day: label,
    baseline: chartData.baseline[index],
    expected: chartData.expected[index],
    actual: chartData.actual[index],
  }));

  return (
    <div style={{ marginTop: "40px", width: "100%", height: "400px" }}>
      <h2>Emissions Analysis</h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line type="monotone" dataKey="baseline" stroke="#8884d8" />
          <Line type="monotone" dataKey="expected" stroke="#00c853" />
          <Line type="monotone" dataKey="actual" stroke="#ff1744" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
