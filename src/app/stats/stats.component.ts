import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ChartConfiguration, ChartOptions } from "chart.js";
import { Country, CountryStats } from '../shared/country.model';
import { CountryService } from '../shared/country.service';
import { StatsService } from '../shared/stats.service';

@Component({
  selector: 'covid-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
})

export class StatsComponent implements OnInit {

  constructor(private statsService: StatsService, private countryService: CountryService) { }

  selectedCountry!: string;
  countryStats!: CountryStats;
  _onDestroy = new Subject<void>();

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July'
    ],
    datasets: [
      {
        data: [ 65, 59, 80, 81, 56, 55, 40 ],
        label: 'Series A',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };
  public lineChartLegend = true;

  ngOnInit(): void {
    this.countryService.getSelectedCountry()
    .pipe(takeUntil(this._onDestroy))
    .subscribe((country: Country) => { if (country?.name) 
        this.selectedCountry = country.name })
        
    this.getStatsForCountry();
  }
  
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  getStatsForCountry() {
    if(this.selectedCountry){
      this.statsService.getAll({ country: this.selectedCountry })      
        .pipe(takeUntil(this._onDestroy))
        .subscribe((countryStats: CountryStats) => {
          this.countryStats = countryStats;
      })
    }
  }

}
