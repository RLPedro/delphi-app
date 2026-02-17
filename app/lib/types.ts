export interface Site {
    name: string;
    base_url: string;
    description: string | null;
    country_code: string | null;
    created_at: string;
    updated_at: string;
}

export interface Location {
    id: string;
    site_name: string;
    url: string;
    change_freq: string | null;
    last_mod: string | null;
    priority: number | null;
    candidate_sku: string | null;
    tags: string[];
    tokens: string[];
    first_seen_at: string;
    last_seen_at: string;
    packaging: string | null;
    marketing_info: string[];
}

export interface DiscoveryRun {
    id: number;
    start_time: string;
    end_time: string | null;
    duration_ms: number | null;
    status: string;
    locations_linked_to_run: number;
    total_errors_for_run: number;
}

export interface RunLocation {
    run_id: number;
    location_id: string;
    discovered_at_in_run: string;
}

export interface RunDelta {
    current_run_id: number;
    previous_run_id: number | null;
    current_run_start_time: string;
    previous_run_start_time: string;
    new_locations_count: number;
    removed_locations_count: number;
}

export interface DashboardData {
    sites: Site[];
    locations: Location[];
    discoveryRuns: DiscoveryRun[];
    runDeltas: RunDelta[];
    stats: DashboardStats;
}

export interface DashboardStats {
    totalSites: number;
    totalLocations: number;
    totalRuns: number;
    latestRunStatus: string;
    avgRunDurationMs: number;
    totalNewLocations: number;
    totalRemovedLocations: number;
}
