import { DashboardStats } from "../../lib/types";

interface StatsBarProps {
    stats: DashboardStats;
}

export default function StatsBar({ stats }: StatsBarProps) {
    const items = [
        { label: "Sites Tracked", value: stats.totalSites, accent: false, sub: "active vendors" },
        { label: "Products Found", value: stats.totalLocations.toLocaleString(), accent: true, sub: "across all sites" },
        { label: "Discovery Runs", value: stats.totalRuns, accent: false, sub: `latest: ${stats.latestRunStatus}` },
        { label: "Avg Duration", value: `${(stats.avgRunDurationMs / 1000).toFixed(1)}s`, accent: false, sub: "per run" },
        { label: "New Products", value: `+${stats.totalNewLocations}`, accent: true, sub: "recent deltas" },
        { label: "Removed", value: `-${stats.totalRemovedLocations}`, accent: false, sub: "recent deltas" },
    ];

    return (
        <div className="stats-bar">
            {items.map((item) => (
                <div key={item.label} className="stat-card">
                    <span className="stat-label">{item.label}</span>
                    <span className={`stat-value ${item.accent ? "accent" : ""}`}>{item.value}</span>
                    <span className="stat-sub">{item.sub}</span>
                </div>
            ))}
        </div>
    );
}
