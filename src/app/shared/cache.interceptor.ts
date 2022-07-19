import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { CacheService } from './cache.service';
import { TimerService } from './timer.service';


@Injectable()
export class CacheInterceptor implements HttpInterceptor {
    constructor(
        private cacheService: CacheService,
        private timerService: TimerService
    ) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<any> {
        this.timerService.startTimer();
        let remainingTimeInMilliseconds = this.timerService.remainingTime();
        if (remainingTimeInMilliseconds <= 0) {
            this.timerService.resetTimer();
            console.log(
                `Fetching data from api: ${req.method} ${req.urlWithParams}`
            );
            this.cacheService.nullifyCache();
        }

        if (req.method === 'GET') {
            const cachedResponse:
                | HttpResponse<any>
                | undefined = this.cacheService.get(req.urlWithParams);

            if (cachedResponse) {
                console.log("cached response...", cachedResponse);
                return of(cachedResponse);
            }

            return next.handle(req).pipe(
                tap((event) => {
                    if (event instanceof HttpResponse) {
                        console.log("Add api call to cache...", req.urlWithParams);
                        this.cacheService.add(req.urlWithParams, event);
                    }
                })
            );
        }
        else {
            return next.handle(req);
        }
    }
}