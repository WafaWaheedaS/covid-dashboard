import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { HttpOpt } from './http-opt.model';
import { covidApiUrl } from '../app.constants';
import * as countryCodeLookup from 'country-code-lookup';

@Injectable()
export class HistoryService {
    constructor(private http: HttpClient) { }
    private historyApiUrl = covidApiUrl + '/history';

    public getData({
        country, day
    }: {
        country?: string;
        day?: string;
    } = {}): Observable<any> {
        const httpOptions: HttpOpt = {};
        country
            ? (httpOptions.params = { ...httpOptions.params, country })
            : (httpOptions.params = { ...httpOptions.params });
        day
            ? (httpOptions.params = { ...httpOptions.params, day })
            : (httpOptions.params = { ...httpOptions.params });

        return this.http.get<any>(this.historyApiUrl, httpOptions).pipe(
            map(res => {
                let countryHistoryData: any[] = [];
                res.response.map((stat: any) => countryHistoryData.push({ ...stat, "name": stat.country, "id": countryCodeLookup.byCountry(stat.country)?.fips }))
                localStorage.setItem(`${res.response.country}HistoryData`, JSON.stringify(countryHistoryData));
                return countryHistoryData;
            }),
        );
    }

}
