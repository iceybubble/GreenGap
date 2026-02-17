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
  <CartesianGrid strokeDasharray="3 3" stroke="#2a1408" />
<XAxis stroke="#fbbf24" />
<YAxis stroke="#fbbf24" />

  <Tooltip />
  <Legend />

  <Line
  type="monotone"
  dataKey="baseline"
  stroke="#facc15"   // YELLOW
  strokeWidth={3}
  dot={false}
/>

<Line
  type="monotone"
  dataKey="expected"
  stroke="#38bdf8"   // SKY BLUE
  strokeWidth={3}
  dot={false}
/>

<Line
  type="monotone"
  dataKey="actual"
  stroke="#ef4444"   // RED
  strokeWidth={3}
  dot={false}
/>

</LineChart>


    </div>
  );
}
