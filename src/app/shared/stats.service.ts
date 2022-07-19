import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { CountryStats, HttpOpt } from './model';
import { covidApiUrl } from '../app.constants';
import * as countryCodeLookup from 'country-code-lookup';

@Injectable()
export class StatsService {
  constructor(private http: HttpClient) {}
  private statsApiUrl = covidApiUrl+'/statistics';

  public getAll({
    country
  }: {
    country?: string;
  } = {}): Observable<any> {
    const httpOptions: HttpOpt = {};
    country
      ? (httpOptions.params = { ...httpOptions.params, country })
      : (httpOptions.params = { ...httpOptions.params });

    return this.http.get<any>(this.statsApiUrl, httpOptions).pipe(
      map(res => {
        let countriesStats: CountryStats[] = [];
        res.response.map(  (stat: any) => countriesStats.push({...stat, "name": stat.country, "id": countryCodeLookup.byCountry(stat.country)?.fips}))
        localStorage.setItem('countriesStats', JSON.stringify(countriesStats));
        return countriesStats;
      }),
    );
  }

}
