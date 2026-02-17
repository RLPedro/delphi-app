import { Site, Location } from "../../lib/types";

interface SitesOverviewProps {
    sites: Site[];
    locations: Location[];
}

export default function SitesOverview({ sites, locations }: SitesOverviewProps) {
    return (
        <div className="sites-grid">
            {sites.map((site) => {
                const count = locations.filter((l) => l.site_name === site.name).length;
                return (
                    <div key={site.name} className="site-card">
                        <div className="site-name">
                            {site.name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                            {site.country_code && <span className="site-country">{site.country_code}</span>}
                        </div>
                        <div className="site-url">{site.base_url.replace(/^https?:\/\//, "")}</div>
                        {site.description && <div className="site-desc">{site.description}</div>}
                        <div className="site-meta">
                            <div>
                                <div className="site-product-count">{count}</div>
                                <div className="site-product-label">products</div>
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                                {new Date(site.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
