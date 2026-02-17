"use client";

import { useState, useMemo } from "react";
import { Location } from "../../lib/types";

interface TagCloudProps {
    locations: Location[];
}

export default function TagCloud({ locations }: TagCloudProps) {
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const tagCounts = useMemo(() => {
        const counts = new Map<string, number>();
        for (const loc of locations) {
            for (const tag of loc.tags) {
                counts.set(tag, (counts.get(tag) ?? 0) + 1);
            }
        }
        return Array.from(counts.entries())
            .sort((a, b) => b[1] - a[1]);
    }, [locations]);

    const maxCount = tagCounts.length > 0 ? tagCounts[0][1] : 1;

    const getSize = (count: number): number => {
        const ratio = count / maxCount;
        if (ratio > 0.8) return 5;
        if (ratio > 0.6) return 4;
        if (ratio > 0.4) return 3;
        if (ratio > 0.2) return 2;
        return 1;
    };

    return (
        <div className="tag-cloud">
            {tagCounts.map(([tag, count]) => (
                <button
                    key={tag}
                    className={`cloud-tag cloud-tag-size-${getSize(count)} ${activeTag === tag ? "active" : ""}`}
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                >
                    {tag}
                    <span className="cloud-tag-count">{count}</span>
                </button>
            ))}
        </div>
    );
}
