import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function EmissionsChart({ chartData }) {
  if (
    !chartData ||
    !chartData.labels ||
    !chartData.baseline ||
    !chartData.expected ||
    !chartData.actual
  ) {
    return <p>Preparing emissions chart...</p>;
  }

  const formatted = chartData.labels.map((label, i) => ({
    day: label,
    baseline: chartData.baseline[i],
    expected: chartData.expected[i],
    actual: chartData.actual[i],
  }));

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Emissions Analysis</h2>

      {/* FIXED WIDTH CHART (NO RESPONSIVECONTAINER) */}
      <LineChart width={900} height={350} data={formatted}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />

        <Line type="monotone" dataKey="baseline" stroke="#8884d8" />
        <Line type="monotone" dataKey="expected" stroke="#00c853" />
        <Line type="monotone" dataKey="actual" stroke="#ff1744" />
      </LineChart>
    </div>
  );
}
