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
    <div className="chart-box">

      <h2>Emissions Analysis</h2>

      <LineChart width={950} height={400} data={formatted}>
  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
  <XAxis dataKey="day" stroke="#94a3b8" />
  <YAxis stroke="#94a3b8" />
  <Tooltip />
  <Legend />

  <Line
    type="monotone"
    dataKey="baseline"
    stroke="#6366f1"
    strokeWidth={3}
    dot={false}
  />

  <Line
    type="monotone"
    dataKey="expected"
    stroke="#22c55e"
    strokeWidth={3}
    dot={false}
  />

  <Line
    type="monotone"
    dataKey="actual"
    stroke="#ef4444"
    strokeWidth={3}
    dot={false}
  />
</LineChart>


    </div>
  );
}
