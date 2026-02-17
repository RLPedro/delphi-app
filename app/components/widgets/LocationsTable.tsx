"use client";

import { useState, useMemo } from "react";
import { Location } from "../../lib/types";

interface LocationsTableProps {
    locations: Location[];
}

type SortKey = "candidate_sku" | "site_name" | "priority" | "last_seen_at" | "packaging";

export default function LocationsTable({ locations }: LocationsTableProps) {
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("last_seen_at");
    const [sortAsc, setSortAsc] = useState(false);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        let result = locations;

        if (q) {
            result = result.filter(
                (l) =>
                    l.candidate_sku?.toLowerCase().includes(q) ||
                    l.site_name.toLowerCase().includes(q) ||
                    l.url.toLowerCase().includes(q) ||
                    l.tags.some((t) => t.toLowerCase().includes(q)) ||
                    l.tokens.some((t) => t.toLowerCase().includes(q)) ||
                    l.packaging?.toLowerCase().includes(q) ||
                    l.marketing_info.some((m) => m.toLowerCase().includes(q))
            );
        }

        result = [...result].sort((a, b) => {
            let cmp = 0;
            switch (sortKey) {
                case "candidate_sku":
                    cmp = (a.candidate_sku ?? "").localeCompare(b.candidate_sku ?? "");
                    break;
                case "site_name":
                    cmp = a.site_name.localeCompare(b.site_name);
                    break;
                case "priority":
                    cmp = (a.priority ?? 0) - (b.priority ?? 0);
                    break;
                case "last_seen_at":
                    cmp = new Date(a.last_seen_at).getTime() - new Date(b.last_seen_at).getTime();
                    break;
                case "packaging":
                    cmp = (a.packaging ?? "").localeCompare(b.packaging ?? "");
                    break;
            }
            return sortAsc ? cmp : -cmp;
        });

        return result;
    }, [locations, search, sortKey, sortAsc]);

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortAsc(!sortAsc);
        } else {
            setSortKey(key);
            setSortAsc(false);
        }
    };

    const sortIndicator = (key: SortKey) => {
        if (sortKey !== key) return "";
        return sortAsc ? " ↑" : " ↓";
    };

    return (
        <>
            <div className="table-search">
                <input
                    type="text"
                    placeholder="Search SKU, site, tag, packaging, claims…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <span style={{ color: 'var(--text-tertiary)', fontSize: 11, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                    {filtered.length} results
                </span>
            </div>
            <div style={{ overflow: 'auto' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className={sortKey === "candidate_sku" ? "sorted" : ""} onClick={() => toggleSort("candidate_sku")}>
                                SKU{sortIndicator("candidate_sku")}
                            </th>
                            <th className={sortKey === "site_name" ? "sorted" : ""} onClick={() => toggleSort("site_name")}>
                                Site{sortIndicator("site_name")}
                            </th>
                            <th>Product Info</th>
                            <th className={sortKey === "packaging" ? "sorted" : ""} onClick={() => toggleSort("packaging")}>
                                Packaging{sortIndicator("packaging")}
                            </th>
                            <th>Marketing</th>
                            <th className={sortKey === "priority" ? "sorted" : ""} onClick={() => toggleSort("priority")}>
                                Priority{sortIndicator("priority")}
                            </th>
                            <th className={sortKey === "last_seen_at" ? "sorted" : ""} onClick={() => toggleSort("last_seen_at")}>
                                Last Seen{sortIndicator("last_seen_at")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((loc) => (
                            <tr key={loc.id}>
                                <td className="cell-mono">{loc.candidate_sku ?? "—"}</td>
                                <td><span className="site-badge">{loc.site_name}</span></td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <a href={loc.url} target="_blank" rel="noopener noreferrer" className="cell-url" style={{ display: 'inline-block', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {loc.url.split('/products/')[1] || loc.url}
                                        </a>
                                        <div className="cell-tags" style={{ gap: '4px' }}>
                                            {loc.tags.slice(0, 2).map((tag) => (
                                                <span key={tag} className="tag-pill" style={{ fontSize: '10px', padding: '2px 6px' }}>{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {loc.packaging ? (
                                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            <span style={{ opacity: 0.7 }}>📦</span> {loc.packaging}
                                        </span>
                                    ) : <span style={{ opacity: 0.3 }}>—</span>}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '200px' }}>
                                        {loc.marketing_info.length > 0 ? loc.marketing_info.map((info) => (
                                            <span key={info} style={{
                                                fontSize: '10px',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                background: 'var(--bg-elevated)',
                                                color: 'var(--accent-secondary)',
                                                border: '1px solid var(--border-subtle)'
                                            }}>
                                                {info}
                                            </span>
                                        )) : <span style={{ opacity: 0.3, fontSize: '12px' }}>—</span>}
                                    </div>
                                </td>
                                <td>
                                    <div className="priority-bar">
                                        <div className="priority-bar-fill" style={{ width: `${(loc.priority ?? 0) * 100}%` }} />
                                    </div>
                                </td>
                                <td className="cell-mono">
                                    {new Date(loc.last_seen_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
