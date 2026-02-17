import { getLocations } from "../lib/data";
import BackNav from "../components/BackNav";
import TagCloud from "../components/widgets/TagCloud";

export default async function TagsPage() {
    const locations = await getLocations();

    // Calculate Tag Counts
    const tagCounts: Record<string, number> = {};
    locations.forEach(l => l.tags.forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1));
    const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a);

    return (
        <main className="detail-main">
            <BackNav />

            <div className="detail-header">
                <h1 className="detail-title">
                    <span className="widget-title-icon">⧉</span>
                    Tag Explorer
                </h1>
                <p className="detail-subtitle">
                    Explore products by their assigned tags and categories.
                </p>
            </div>

            <div className="widget-card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
                <h3 style={{ fontSize: '14px', marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>Top Tags</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                    {sortedTags.map(([tag, count]) => (
                        <div key={tag} className="tag-pill" style={{ padding: 'var(--space-sm) var(--space-md)', background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)', borderRadius: '16px' }}>
                            <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{tag}</span>
                            <span style={{ marginLeft: '8px', opacity: 0.5, fontSize: '0.9em' }}>{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="widget-card">
                <TagCloud locations={locations} />
            </div>
        </main>
    );
}
