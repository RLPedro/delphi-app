import { getSites, getLocations } from "../lib/data";
import BackNav from "../components/BackNav";

export default async function SitesPage() {
    const sites = await getSites();
    const locations = await getLocations();

    return (
        <main className="detail-main">
            <BackNav />

            <div className="detail-header">
                <h1 className="detail-title">
                    <span className="widget-title-icon">◉</span>
                    Sites Overview
                </h1>
                <p className="detail-subtitle">
                    Detailed breakdown of all monitored competitor sites, including product counts and crawl configurations.
                </p>
            </div>

            <div className="section-grid-2">
                {sites.map((site) => {
                    const siteLocations = locations.filter((l) => l.site_name === site.name);
                    const activeCount = siteLocations.length;

                    // Calculate category distribution
                    const categories: Record<string, number> = {};
                    siteLocations.forEach(l => {
                        l.tags.forEach(t => {
                            categories[t] = (categories[t] || 0) + 1;
                        });
                    });
                    const topCategories = Object.entries(categories)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5);

                    return (
                        <div key={site.name} className="widget-card">
                            <div className="widget-header">
                                <div className="widget-title">{site.name}</div>
                                <div className="widget-badge">{activeCount} products</div>
                            </div>
                            <div className="widget-body" style={{ padding: 'var(--space-lg)' }}>
                                <div style={{ marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>
                                    <div style={{ fontSize: '13px', marginBottom: '4px' }}>Base URL</div>
                                    <a href={site.base_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
                                        {site.base_url}
                                    </a>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                                    <div>
                                        <div className="text-secondary text-sm">Last Crawl</div>
                                        <div>{new Date().toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-secondary text-sm">Status</div>
                                        <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span className="status-dot" style={{ background: 'var(--success)' }} />
                                            Active
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                                    {/* Top Categories */}
                                    <div>
                                        <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '8px', letterSpacing: '0.05em' }}>Top Categories</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {topCategories.map(([cat, count]) => (
                                                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                                    <span style={{ color: 'var(--text-secondary)' }}>{cat}</span>
                                                    <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Top Packaging */}
                                    <div>
                                        <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '8px', letterSpacing: '0.05em' }}>Packaging</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {Object.entries(siteLocations.reduce((acc, l) => {
                                                if (l.packaging) acc[l.packaging] = (acc[l.packaging] || 0) + 1;
                                                return acc;
                                            }, {} as Record<string, number>))
                                                .sort(([, a], [, b]) => b - a)
                                                .slice(0, 5)
                                                .map(([pkg, count]) => (
                                                    <div key={pkg} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                                        <span style={{ color: 'var(--text-secondary)' }}>{pkg.replace('-', ' ')}</span>
                                                        <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{count}</span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* Top Marketing Claims */}
                                    <div>
                                        <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '8px', letterSpacing: '0.05em' }}>Marketing Claims</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {Object.entries(siteLocations.reduce((acc, l) => {
                                                l.marketing_info.forEach(m => acc[m] = (acc[m] || 0) + 1);
                                                return acc;
                                            }, {} as Record<string, number>))
                                                .sort(([, a], [, b]) => b - a)
                                                .slice(0, 5)
                                                .map(([claim, count]) => (
                                                    <div key={claim} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                                        <span style={{ color: 'var(--text-secondary)' }}>{claim.replace('-', ' ')}</span>
                                                        <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{count}</span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}
