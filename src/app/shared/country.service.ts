import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { HttpOpt } from './http-opt.model';
import { covidApiUrl } from '../app.constants';

@Injectable()
export class CountryService {
  constructor(private http: HttpClient) {}
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
        console.log(res)
        return res;
      }),
    );
  }

}
