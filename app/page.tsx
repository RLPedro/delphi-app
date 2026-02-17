import { getDashboardData } from "./lib/data";
import StatsBar from "./components/widgets/StatsBar";
import DashboardGrid from "./components/DashboardGrid";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <main className="dashboard-main">
      <StatsBar stats={data.stats} />
      <DashboardGrid data={data} />
    </main>
  );
}
