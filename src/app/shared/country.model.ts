export interface Country {
    name?: string;
    id?: string;
}

export interface CountryStats extends Country {
    day: string;
    cases?: {
        active: number;
        '1M_pop': number;
        critical: number;
        recovered: number;
        total: number;
        new: number;
    }
    deaths?: {
        total: number;
        new: number;
    }
}

export interface HistoricalCountryStats {
    date: string;
    stats: CountryStats;
}