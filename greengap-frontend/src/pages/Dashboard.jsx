import { useEffect, useState } from "react";
import { fetchDashboard } from "../services/api";
import SummaryCards from "../components/SummaryCards";
import EmissionsChart from "../components/EmissionsChart";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard().then((res) => {
      setData(res.data.dashboard);
    });
  }, []);

  if (!data) {
    return <h2>Loading GreenGap Dashboard...</h2>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">GreenGap Climate Dashboard</h1>

      <SummaryCards summary={data.summary_cards} />

      <h2 className="section-title">Emissions Analysis</h2>

      <EmissionsChart chartData={data.emissions_chart} />
    </div>
  );
}
