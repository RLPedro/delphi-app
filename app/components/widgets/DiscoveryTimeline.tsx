import { DiscoveryRun } from "../../lib/types";

interface DiscoveryTimelineProps {
    runs: DiscoveryRun[];
}

export default function DiscoveryTimeline({ runs }: DiscoveryTimelineProps) {
    const sorted = [...runs].sort(
        (a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
    );

    return (
        <div className="timeline-list">
            {sorted.map((run) => (
                <div key={run.id} className="timeline-item">
                    <div className={`timeline-status ${run.status}`} />
                    <div className="timeline-info">
                        <div className="timeline-time">
                            {new Date(run.start_time).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' })}
                            {" "}
                            {new Date(run.start_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="timeline-detail">
                            <span className="timeline-stat">
                                <span style={{ color: 'var(--text-tertiary)' }}>locs:</span>
                                <span className="timeline-stat-value">{run.locations_linked_to_run}</span>
                            </span>
                            <span className="timeline-stat">
                                <span style={{ color: 'var(--text-tertiary)' }}>errors:</span>
                                <span className="timeline-stat-value" style={{ color: run.total_errors_for_run > 0 ? 'var(--accent-danger)' : 'var(--text-secondary)' }}>
                                    {run.total_errors_for_run}
                                </span>
                            </span>
                        </div>
                    </div>
                    <div className="timeline-duration">
                        {run.duration_ms ? `${(run.duration_ms / 1000).toFixed(1)}s` : "—"}
                    </div>
                </div>
            ))}
        </div>
    );
}
