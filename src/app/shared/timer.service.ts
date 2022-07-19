import { Injectable } from '@angular/core';
import { covidRapidApiDataUpdateFrequency } from '../app.constants';

@Injectable({ providedIn: 'root' })
export class TimerService {
    constructor() { }

    timerStart: boolean = false;
    dateDay: Date = new Date();
    timeDifference: any;

    timeInBetween() {
        this.timeDifference = this.dateDay.getTime() - new Date().getTime();
    }

    startTimer() {
        if (!this.timerStart) {
            this.dateDay.setMinutes(
                this.dateDay.getMinutes() + covidRapidApiDataUpdateFrequency
            );
            this.timeInBetween();
            this.timerStart = true;
        }
    }

    resetTimer() {
        this.timerStart = false;
        this.timeInBetween();
    }

    remainingTime(): number {
        this.timeInBetween();
        return this.timeDifference;
    }
}