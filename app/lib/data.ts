import { DashboardData, DashboardStats, Site, Location as LocationType, DiscoveryRun, RunDelta } from "./types";
import {
    mockSites,
    mockLocations,
    mockDiscoveryRuns,
    mockRunDeltas,
} from "./mock-data";

export async function getSites(): Promise<Site[]> {
    return mockSites;
}

export async function getLocations(): Promise<LocationType[]> {
    return mockLocations;
}

export async function getDiscoveryRuns(): Promise<DiscoveryRun[]> {
    return mockDiscoveryRuns;
}

export async function getRunDeltas(): Promise<RunDelta[]> {
    return mockRunDeltas;
}

export async function getDashboardData(): Promise<DashboardData> {
    const sites = mockSites;
    const locations = mockLocations;
    const discoveryRuns = mockDiscoveryRuns;
    const runDeltas = mockRunDeltas;

    const completedRuns = discoveryRuns.filter((r) => r.duration_ms !== null);
    const avgDuration =
        completedRuns.length > 0
            ? completedRuns.reduce((sum, r) => sum + (r.duration_ms ?? 0), 0) /
            completedRuns.length
            : 0;

    const stats: DashboardStats = {
        totalSites: sites.length,
        totalLocations: locations.length,
        totalRuns: discoveryRuns.length,
        latestRunStatus:
            discoveryRuns.length > 0
                ? discoveryRuns[discoveryRuns.length - 1].status
                : "none",
        avgRunDurationMs: Math.round(avgDuration),
        totalNewLocations: runDeltas.reduce(
            (sum, d) => sum + d.new_locations_count,
            0
        ),
        totalRemovedLocations: runDeltas.reduce(
            (sum, d) => sum + d.removed_locations_count,
            0
        ),
    };

    return { sites, locations, discoveryRuns, runDeltas, stats };
}
