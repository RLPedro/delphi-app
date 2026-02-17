import { getDiscoveryRuns } from "../lib/data";
import BackNav from "../components/BackNav";
import DiscoveryTimeline from "../components/widgets/DiscoveryTimeline";

export default async function RunHistoryPage() {
    const runs = await getDiscoveryRuns();

    return (
        <main className="detail-main">
            <BackNav />

            <div className="detail-header">
                <h1 className="detail-title">
                    <span className="widget-title-icon">⟳</span>
                    Discovery Runs
                </h1>
                <p className="detail-subtitle">
                    Historical log of all discovery execution runs, including duration and error rates.
                </p>
            </div>

            <div className="widget-card" style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                    <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Recent Run Durations</h3>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Last 30 Runs</div>
                </div>

                <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', height: '180px', gap: '8px', minWidth: 'max-content', paddingRight: '20px' }}>
                        {runs.slice(0, 30).reverse().map((r, i) => {
                            const date = new Date(r.start_time).getDate();
                            const month = new Date(r.start_time).toLocaleString('default', { month: 'short' });
                            // Normalize height (max 5 minutes = 300000ms)
                            const heightPct = Math.min((r.duration_ms / 300000) * 100, 100);

                            return (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '24px' }}>
                                    {/* Bar Container */}
                                    <div style={{ height: '140px', width: '100%', display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
                                        {/* Value Label on Hover (simulated with just static occasional labels or tooltip) */}
                                        <div
                                            style={{
                                                width: '100%',
                                                height: `${Math.max(heightPct, 5)}%`,
                                                background: r.status === 'failed' ? 'var(--danger)' : 'var(--accent-primary)',
                                                opacity: 0.8,
                                                borderRadius: '2px 2px 0 0',
                                                transition: 'height 0.3s ease'
                                            }}
                                            title={`Date: ${new Date(r.start_time).toLocaleDateString()}\nDuration: ${(r.duration_ms / 1000).toFixed(1)}s\nStatus: ${r.status}`}
                                        />
                                    </div>

                                    {/* Date Label */}
                                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textAlign: 'center', lineHeight: '1' }}>
                                        <div style={{ marginBottom: '2px' }}>{month}</div>
                                        <div>{date}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="widget-card">
                <DiscoveryTimeline runs={runs} />
            </div>
        </main>
    );
}
