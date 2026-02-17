"use client";

import Link from "next/link";
import { useCallback, useState, useEffect, useRef } from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { Responsive as ResponsiveBase } from "react-grid-layout";
const Responsive = ResponsiveBase as any; // bundled types are stale in v2
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { DashboardData } from "../lib/types";

import SitesOverview from "./widgets/SitesOverview";
import LocationsTable from "./widgets/LocationsTable";
import DiscoveryTimeline from "./widgets/DiscoveryTimeline";
import RunDeltasChart from "./widgets/RunDeltasChart";
import TagCloud from "./widgets/TagCloud";

const STORAGE_KEY = "leitao-dashboard-layouts";

interface LayoutItem {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
}

type Layouts = Record<string, LayoutItem[]>;

const defaultLayouts: Layouts = {
    lg: [
        { i: "sites", x: 0, y: 0, w: 5, h: 7, minW: 3, minH: 5 },
        { i: "deltas", x: 5, y: 0, w: 4, h: 7, minW: 3, minH: 5 },
        { i: "timeline", x: 9, y: 0, w: 3, h: 7, minW: 2, minH: 4 },
        { i: "locations", x: 0, y: 7, w: 8, h: 9, minW: 4, minH: 6 },
        { i: "tags", x: 8, y: 7, w: 4, h: 9, minW: 2, minH: 4 },
    ],
    md: [
        { i: "sites", x: 0, y: 0, w: 5, h: 7, minW: 3, minH: 5 },
        { i: "deltas", x: 5, y: 0, w: 5, h: 7, minW: 3, minH: 5 },
        { i: "timeline", x: 0, y: 7, w: 4, h: 7, minW: 2, minH: 4 },
        { i: "locations", x: 0, y: 14, w: 10, h: 9, minW: 4, minH: 6 },
        { i: "tags", x: 4, y: 7, w: 6, h: 7, minW: 2, minH: 4 },
    ],
    sm: [
        { i: "sites", x: 0, y: 0, w: 6, h: 7, minW: 3, minH: 5 },
        { i: "deltas", x: 0, y: 7, w: 6, h: 7, minW: 3, minH: 5 },
        { i: "timeline", x: 0, y: 14, w: 6, h: 7, minW: 2, minH: 4 },
        { i: "locations", x: 0, y: 21, w: 6, h: 9, minW: 4, minH: 6 },
        { i: "tags", x: 0, y: 30, w: 6, h: 7, minW: 2, minH: 4 },
    ],
};

const widgetMeta: Record<string, { title: string; icon: string; href: string }> = {
    sites: { title: "Sites Overview", icon: "◉", href: "/sites" },
    locations: { title: "Product Locations", icon: "⊞", href: "/locations" },
    timeline: { title: "Discovery Runs", icon: "⟳", href: "/runs" },
    deltas: { title: "Run Deltas", icon: "Δ", href: "/deltas" },
    tags: { title: "Tag Cloud", icon: "⧉", href: "/tags" },
};

function useContainerWidth(ref: React.RefObject<HTMLDivElement | null>) {
    const [width, setWidth] = useState(1200);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setWidth(entry.contentRect.width);
            }
        });

        observer.observe(el);
        setWidth(el.getBoundingClientRect().width);

        return () => observer.disconnect();
    }, [ref]);

    return width;
}

interface DashboardGridProps {
    data: DashboardData;
}

export default function DashboardGrid({ data }: DashboardGridProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const containerWidth = useContainerWidth(containerRef);
    const [layouts, setLayouts] = useState<Layouts>(defaultLayouts);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setLayouts(JSON.parse(saved));
            }
        } catch {
            // ignore
        }
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onLayoutChange = useCallback((_layout: any, allLayouts: any) => {
        setLayouts(allLayouts);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allLayouts));
        } catch {
            // ignore
        }
    }, []);

    const renderWidget = (id: string) => {
        switch (id) {
            case "sites":
                return <SitesOverview sites={data.sites} locations={data.locations} />;
            case "locations":
                return <LocationsTable locations={data.locations} />;
            case "timeline":
                return <DiscoveryTimeline runs={data.discoveryRuns} />;
            case "deltas":
                return <RunDeltasChart deltas={data.runDeltas} />;
            case "tags":
                return <TagCloud locations={data.locations} />;
            default:
                return null;
        }
    };

    return (
        <div ref={containerRef}>
            {mounted && containerWidth > 0 && (
                <Responsive
                    className="react-grid-layout"
                    width={containerWidth}
                    layouts={layouts}
                    breakpoints={{ lg: 1200, md: 900, sm: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6 }}
                    rowHeight={36}
                    draggableHandle=".drag-handle"
                    onLayoutChange={onLayoutChange}
                    compactType="vertical"
                    margin={[14, 14]}
                >
                    {Object.keys(widgetMeta).map((id) => (
                        <div key={id}>
                            <div className="widget-card">
                                <div className="widget-header">
                                    <div className="widget-title">
                                        <Link href={widgetMeta[id].href} className="widget-title-link">
                                            <span className="widget-title-icon">{widgetMeta[id].icon}</span>
                                            {widgetMeta[id].title}
                                        </Link>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                        {id === "locations" && (
                                            <span className="widget-badge">{data.locations.length}</span>
                                        )}
                                        {id === "sites" && (
                                            <span className="widget-badge">{data.sites.length}</span>
                                        )}
                                        {id === "timeline" && (
                                            <span className="widget-badge">{data.discoveryRuns.length}</span>
                                        )}
                                        <div className="drag-handle">
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                                                <circle cx="9" cy="12" r="1" />
                                                <circle cx="9" cy="5" r="1" />
                                                <circle cx="9" cy="19" r="1" />
                                                <circle cx="15" cy="12" r="1" />
                                                <circle cx="15" cy="5" r="1" />
                                                <circle cx="15" cy="19" r="1" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="widget-body">
                                    {renderWidget(id)}
                                </div>
                            </div>
                        </div>
                    ))}
                </Responsive>
            )}
        </div>
    );
}
