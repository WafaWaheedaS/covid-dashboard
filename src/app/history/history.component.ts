import { Component, OnInit } from '@angular/core';
import { concat, Subject, takeUntil } from 'rxjs';
import { ChartConfiguration, ChartOptions } from "chart.js";
import { HistoryService } from '../shared/history.service';
import { CountryService } from '../shared/country.service';
import { CountryStats, Country, HistoricalCountryStats } from '../shared/country.model';
import { dateLabel, dates } from '../app.constants';

@Component({
  selector: 'covid-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  constructor(private countryService: CountryService, private historyService: HistoryService) { }
  
  selectedCountry!: string;
  countryStats: HistoricalCountryStats[] = [];
  recoveredCases: any[] = [];
  totalCases: any[] = [];
  _onDestroy = new Subject<void>();
  public lineChartData!: ChartConfiguration<'line'>['data'];
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };
  public lineChartLegend = true;

  ngOnInit(): void {
    this.countryService.getSelectedCountry()
    .pipe(takeUntil(this._onDestroy))
    .subscribe((country: Country) => { if (country?.name) {
        this.selectedCountry = country.name;
        this.countryStats = []
        this.totalCases = []
        this.recoveredCases = []
        this.getHistoryDataForCountry();
      }
      })
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  getHistoryDataForCountry() {
    if(this.selectedCountry){
      dates.map(date => {
        this.historyService.getData({ country: this.selectedCountry, day: date })      
        .pipe(takeUntil(this._onDestroy))
        .subscribe((countryStats: CountryStats[]) => {
          if(countryStats) { 
            this.countryStats.push({'date': date, stats: countryStats[0]});
            if(countryStats[0]?.cases) {
              const recovered = countryStats[0].cases.recovered? countryStats[0].cases.recovered: 0;
              const total = countryStats[0].cases.total? countryStats[0].cases.total: 0;
              this.recoveredCases
              .push({ 'date': date, 'value': recovered});
              this.totalCases
              .push({ 'date': date, 'value': total});
            }
        }
      }, (error)=> console.log(error), () => this.populateLineChartData())
      })
      this.populateLineChartData()
    }
  }  

  populateLineChartData() {
    this.lineChartData = {
      labels: dateLabel,
      datasets: [
        {
          data: this.recoveredCases
          .map(elem => elem.value? elem.value:0),
          label: 'Recovered Cases',
          fill: true,
          tension: 0.5,
          borderColor: 'black',
          backgroundColor: '#ff99cf'
        },
        {
          data: this.totalCases
          .map(elem => elem.value? elem.value:0),
          label: 'Total Cases',
          fill: true,
          tension: 0.5,
          borderColor: 'black',
          backgroundColor: '#990052'
        }
      ]
    };
  }

}
