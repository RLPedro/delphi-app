import { getRunDeltas } from "../lib/data";
import BackNav from "../components/BackNav";
import RunDeltasChart from "../components/widgets/RunDeltasChart";
import { RunDelta } from "../lib/types";

export default async function DeltasPage() {
    const deltas = await getRunDeltas();

    return (
        <main className="detail-main">
            <BackNav />

            <div className="detail-header">
                <h1 className="detail-title">
                    <span className="widget-title-icon">Δ</span>
                    Run Deltas
                </h1>
                <p className="detail-subtitle">
                    Analysis of product changes (additions vs removals) over time.
                </p>
            </div>

            {/* Stats Summary */}
            <div className="widget-card" style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-xl)' }}>
                    <div>
                        <div className="text-secondary text-sm">Net Growth (30d)</div>
                        <div className="text-xl font-bold" style={{ color: 'var(--success)' }}>
                            +{deltas.reduce((acc, d) => acc + (d.new_locations_count - d.removed_locations_count), 0)}
                        </div>
                    </div>
                    <div>
                        <div className="text-secondary text-sm">Total Added</div>
                        <div className="text-xl font-bold" style={{ color: 'var(--success)' }}>{deltas.reduce((acc, d) => acc + d.new_locations_count, 0)}</div>
                    </div>
                    <div>
                        <div className="text-secondary text-sm">Total Removed</div>
                        <div className="text-xl font-bold" style={{ color: 'var(--danger)' }}>{deltas.reduce((acc, d) => acc + d.removed_locations_count, 0)}</div>
                    </div>
                </div>
            </div>

            <div className="widget-card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
                <h3 style={{ fontSize: '14px', marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>Additions vs Removals (Last 30 Days)</h3>

                {deltas.length === 0 ? (
                    <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>No run data available</div>
                ) : (
                    <div style={{ overflowX: 'auto', paddingBottom: '12px' }}>
                        <div style={{ display: 'flex', height: '220px', alignItems: 'flex-end', gap: '6px', minWidth: 'max-content', paddingRight: '20px' }}>
                            {deltas.slice(-30).map((d: RunDelta, i: number) => {
                                const date = new Date(d.current_run_start_time).getDate();
                                const month = new Date(d.current_run_start_time).toLocaleString('default', { month: 'short' });
                                return (
                                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: '24px' }}>
                                        <div style={{
                                            position: 'relative',
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            height: '160px', // Fixed height for bar area
                                            justifyContent: 'flex-end' // Align bars to bottom of this area
                                        }}>
                                            {/* Additions Bar */}
                                            <div
                                                style={{
                                                    width: '100%',
                                                    height: `${Math.max(d.new_locations_count * 8, 4)}px`, // Min height 4px
                                                    background: 'var(--success)',
                                                    borderRadius: '2px',
                                                    opacity: d.new_locations_count > 0 ? 0.9 : 0.3,
                                                    marginBottom: '1px'
                                                }}
                                                title={`Run: ${d.current_run_start_time}\nAdded: ${d.new_locations_count}`}
                                            />

                                            {/* Divider */}
                                            <div style={{ width: '100%', height: '1px', background: 'var(--border-subtle)', margin: '1px 0' }} />

                                            {/* Removals Bar */}
                                            <div
                                                style={{
                                                    width: '100%',
                                                    height: `${Math.max(d.removed_locations_count * 8, 4)}px`, // Min height 4px
                                                    background: 'var(--danger)',
                                                    borderRadius: '2px',
                                                    opacity: d.removed_locations_count > 0 ? 0.9 : 0.3
                                                }}
                                                title={`Run: ${d.current_run_start_time}\nRemoved: ${d.removed_locations_count}`}
                                            />
                                        </div>
                                        {/* Date Label */}
                                        <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textAlign: 'center', lineHeight: '1.2' }}>
                                            <div>{month}</div>
                                            <div>{date}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className="widget-card">
                <RunDeltasChart deltas={deltas} />
            </div>
        </main>
    );
}
