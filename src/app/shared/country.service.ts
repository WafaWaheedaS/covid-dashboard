import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { HttpOpt } from './http-opt.model';
import { covidApiUrl, defaultSelectedCountry } from '../app.constants';
import * as countryCodeLookup from 'country-code-lookup';
import { Country } from './country.model';

@Injectable()
export class CountryService {
  constructor(private http: HttpClient) {}

  
  private selectedCountry = new BehaviorSubject<Country>(defaultSelectedCountry);

  private countryApiUrl = covidApiUrl+'/countries';

  public getAll({
    search
  }: {
    search?: string;
  } = {}): Observable<any> {
    const httpOptions: HttpOpt = {};
    search
      ? (httpOptions.params = { ...httpOptions.params, search })
      : (httpOptions.params = { ...httpOptions.params });

    return this.http.get<any>(this.countryApiUrl, httpOptions).pipe(
      map(res => {
        let countries: any[] = [];
        res.response.map(  (country: any) => countries.push({"name": country, "id": countryCodeLookup.byCountry(country)?.fips }))
        localStorage.setItem('countries', JSON.stringify(countries));
        return countries;
      }),
    );
  }

  
  public setSelectedCountry(country: Country): void {
    console.log("setting selected country..", country)
    this.selectedCountry.next(country);
  }

  public getSelectedCountry(): Observable<Country> {
    return this.selectedCountry.asObservable();
  }

}
