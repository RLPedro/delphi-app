import { Site, Location, DiscoveryRun, RunDelta } from "./types";

export const mockSites: Site[] = [
    {
        name: "continente",
        base_url: "https://www.continente.pt",
        description: "Continente Online — Sonae MC hypermarket chain",
        country_code: "PT",
        created_at: "2025-06-01T08:00:00Z",
        updated_at: "2026-02-15T12:30:00Z",
    },
    {
        name: "pingo-doce",
        base_url: "https://www.pingodoce.pt",
        description: "Pingo Doce — Jerónimo Martins supermarket chain",
        country_code: "PT",
        created_at: "2025-06-01T08:00:00Z",
        updated_at: "2026-02-15T12:30:00Z",
    },
    {
        name: "auchan",
        base_url: "https://www.auchan.pt",
        description: "Auchan Portugal — French multinational retail group",
        country_code: "PT",
        created_at: "2025-07-15T10:00:00Z",
        updated_at: "2026-02-14T09:00:00Z",
    },
    {
        name: "lidl",
        base_url: "https://www.lidl.pt",
        description: "Lidl Portugal — German discount supermarket chain",
        country_code: "PT",
        created_at: "2025-08-01T08:00:00Z",
        updated_at: "2026-02-15T11:00:00Z",
    },
];

// --- Generators ---

const CATEGORIES = ['dairy', 'produce', 'meat', 'bakery', 'beverage', 'household', 'personal-care', 'frozen', 'pantry'];
const PRODUCTS = {
    dairy: ['milk', 'cheese', 'yogurt', 'butter', 'cream'],
    produce: ['apples', 'bananas', 'carrots', 'potatoes', 'lettuce', 'tomatoes'],
    meat: ['chicken', 'beef', 'pork', 'sausage', 'ham'],
    bakery: ['bread', 'croissant', 'baguette', 'cake', 'cookies'],
    beverage: ['water', 'soda', 'juice', 'wine', 'beer'],
    household: ['detergent', 'bleach', 'paper-towels', 'trash-bags'],
    'personal-care': ['shampoo', 'soap', 'toothpaste', 'deodorant'],
    frozen: ['pizza', 'ice-cream', 'vegetables', 'fish-fingers'],
    pantry: ['rice', 'pasta', 'beans', 'sugar', 'flour', 'oil']
};
const ADJECTIVES = ['organic', 'premium', 'low-fat', 'gluten-free', 'family-pack', 'fresh', 'classic'];
const BRANDS = ['mimosa', 'delta', 'nobre', 'iglo', 'colgate', 'dove', 'skip', 'sun', 'luso', 'sagres', 'super-bock', 'compal', 'milbona', 'pingo-doce', 'continente', 'auchan'];

function randomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hash(s: string): string {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    }
    return Math.abs(h).toString(16).padStart(8, "0");
}

const PACKAGING_TYPES = ['plastic-wrap', 'cardboard-box', 'glass-jar', 'aluminum-can', 'tetra-pack', 'biodegradable-bag', 'mesh-bag'];
const MARKETING_CLAIMS = ['organic', 'gluten-free', 'sugar-free', 'vegan', 'locally-sourced', 'family-recipe', 'no-preservatives', 'promo-pack', 'award-winning', 'sustainable'];

// Generate 250 Locations
export const mockLocations: Location[] = Array.from({ length: 250 }).map((_, i) => {
    const site = randomElement(mockSites);
    const category = randomElement(CATEGORIES) as keyof typeof PRODUCTS;
    const product = randomElement(PRODUCTS[category]);
    const brand = randomElement(BRANDS);
    const adjective = Math.random() > 0.5 ? randomElement(ADJECTIVES) : '';

    // Construct SKU and Name
    const sku = `${site.name.substring(0, 3).toUpperCase()}-${category.substring(0, 3).toUpperCase()}-${randomInt(100, 999)}`;
    const nameSlug = [brand, product, adjective, randomInt(1, 5) + 'x'].filter(Boolean).join('-').toLowerCase();

    // Generate Marketing Info
    const marketing = [];
    if (Math.random() > 0.7) marketing.push(randomElement(MARKETING_CLAIMS));
    if (Math.random() > 0.8) marketing.push(randomElement(MARKETING_CLAIMS));

    return {
        id: hash(`${site.base_url}/${nameSlug}${i}`),
        site_name: site.name,
        url: `${site.base_url}/products/${nameSlug}`,
        change_freq: randomElement(["daily", "daily", "weekly", "weekly", "monthly"]),
        last_mod: new Date(Date.now() - randomInt(0, 30) * 86400000).toISOString(),
        priority: Math.random(),
        candidate_sku: sku,
        tags: [category, product, adjective, brand].filter(Boolean),
        tokens: [brand, product, adjective].filter(Boolean),
        first_seen_at: new Date(Date.now() - randomInt(30, 365) * 86400000).toISOString(),
        last_seen_at: new Date(Date.now() - randomInt(0, 5) * 86400000).toISOString(),
        packaging: Math.random() > 0.3 ? randomElement(PACKAGING_TYPES) : null,
        marketing_info: [...new Set(marketing)], // Deduplicate
    };
});

// Generate 60 Days of Runs
const today = new Date();
export const mockDiscoveryRuns: DiscoveryRun[] = Array.from({ length: 60 }).map((_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (59 - i));

    const errors = Math.random() > 0.9 ? randomInt(1, 15) : 0;
    const status = errors > 10 ? "failed" : "completed";
    const duration = randomInt(60000, 300000); // 1-5 mins

    return {
        id: date.getTime(),
        start_time: date.toISOString(),
        end_time: new Date(date.getTime() + duration).toISOString(),
        duration_ms: duration,
        status: status,
        locations_linked_to_run: randomInt(150, 250),
        total_errors_for_run: errors,
    };
});

// Generate Deltas for those runs
export const mockRunDeltas: RunDelta[] = mockDiscoveryRuns.slice(1).map((run, i) => {
    const prevRun = mockDiscoveryRuns[i];
    return {
        current_run_id: run.id,
        previous_run_id: prevRun.id,
        current_run_start_time: run.start_time,
        previous_run_start_time: prevRun.start_time,
        new_locations_count: randomInt(0, 15),
        removed_locations_count: randomInt(0, 10),
    };
});
