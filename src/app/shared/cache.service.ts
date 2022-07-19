import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CacheService {
    constructor() { }

    private requests: any = {};

    get(url: string): HttpResponse<any> | undefined {
        return this.requests[url];
    }

    add(url: string, response: HttpResponse<any>): void {
        this.requests[url] = response;
    }

    nullifyCache(): void {
        this.requests = {};
    }

    nullifyUrl(url: string): void {
        this.requests[url] = undefined;
    }

}