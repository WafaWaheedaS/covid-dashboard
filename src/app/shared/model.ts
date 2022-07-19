export interface HttpOpt {
    headers?: any;
    params?: any;
  }

export interface StatValue {
    date?: string;
    value?: number;
}


export interface Country {
    name?: string;
    id?: string;
}

export interface AffectedCountry {
    name: string;
    total: number;
    recovered: number;
    active: number;
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

export interface HttpOpt {
    headers?: any;
    params?: any;
  }