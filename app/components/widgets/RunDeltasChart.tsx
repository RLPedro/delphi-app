import { RunDelta } from "../../lib/types";

interface RunDeltasChartProps {
    deltas: RunDelta[];
}

export default function RunDeltasChart({ deltas }: RunDeltasChartProps) {
    const sorted = [...deltas].sort(
        (a, b) => new Date(a.current_run_start_time).getTime() - new Date(b.current_run_start_time).getTime()
    );

    const maxCount = Math.max(
        ...sorted.map((d) => Math.max(d.new_locations_count, d.removed_locations_count)),
        1
    );

    return (
        <div className="deltas-chart">
            {sorted.map((delta) => (
                <div key={delta.current_run_id} className="delta-row">
                    <div className="delta-label">
                        {new Date(delta.current_run_start_time).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </div>
                    <div className="delta-bars">
                        <div
                            className="delta-bar added"
                            style={{ width: `${Math.max((delta.new_locations_count / maxCount) * 100, 12)}%` }}
                        >
                            +{delta.new_locations_count}
                        </div>
                        <div
                            className="delta-bar removed"
                            style={{ width: `${Math.max((delta.removed_locations_count / maxCount) * 100, 12)}%` }}
                        >
                            −{delta.removed_locations_count}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
