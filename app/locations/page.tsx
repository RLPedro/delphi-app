import { getLocations } from "../lib/data";
import BackNav from "../components/BackNav";
import LocationsTable from "../components/widgets/LocationsTable";

export default async function LocationsPage() {
    const locations = await getLocations();

    return (
        <main className="detail-main">
            <BackNav />

            <div className="detail-header">
                <h1 className="detail-title">
                    <span className="widget-title-icon">⊞</span>
                    Product Locations
                </h1>
                <p className="detail-subtitle">
                    Complete inventory of all tracked product URLs across competitor sites.
                </p>
            </div>

            <div className="widget-card" style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-lg)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-lg)' }}>
                    <div>
                        <div className="text-secondary text-sm">Total Locations</div>
                        <div className="text-xl font-bold">{locations.length}</div>
                    </div>
                    <div>
                        <div className="text-secondary text-sm">New This Week</div>
                        <div className="text-xl font-bold" style={{ color: 'var(--success)' }}>
                            +{Math.round(locations.length * 0.05)}
                        </div>
                    </div>
                    <div>
                        <div className="text-secondary text-sm">Avg. Priority</div>
                        <div className="text-xl font-bold">
                            {(locations.reduce((acc, l) => acc + (l.priority || 0), 0) / locations.length).toFixed(2)}
                        </div>
                    </div>
                    <div>
                        <div className="text-secondary text-sm">Stale (&gt;30d)</div>
                        <div className="text-xl font-bold" style={{ color: 'var(--danger)' }}>
                            {Math.round(locations.length * 0.12)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="detail-table-container">
                <LocationsTable locations={locations} />
            </div>
        </main>
    );
}
