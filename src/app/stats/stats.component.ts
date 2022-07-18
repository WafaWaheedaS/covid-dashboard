import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ChartConfiguration } from "chart.js";
import { CountryStats } from '../shared/country.model';
import { StatsService } from '../shared/stats.service';

@Component({
  selector: 'covid-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
})

export class StatsComponent implements OnInit {

  constructor(private statsService: StatsService) { }

  selectedCountry!: string;
  countriesStats!: CountryStats[];
  affectedCountries!: any[];
  _onDestroy = new Subject<void>();

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData!: ChartConfiguration<'bar'>['data'];
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };

  ngOnInit(): void {
    this.getStatsForAllContries();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  getStatsForAffectedCountries() {
   this.affectedCountries?.forEach((country: any) => {
    this.statsService.getAll({ country: this.selectedCountry })
    .pipe(takeUntil(this._onDestroy))
    .subscribe((countriesStats: CountryStats[]) => {
    })
   })
  }

  getStatsForAllContries() {
    this.statsService.getAll()
      .pipe(takeUntil(this._onDestroy))
      .subscribe((countriesStats: CountryStats[]) => {
        this.countriesStats = countriesStats;
        this.findMostAffectedCountries()
      })

  }

  findMostAffectedCountries() {
    let countriesTotalCases: any[] = [];
    this.countriesStats?.forEach((stat) => countriesTotalCases.push({
      'name': stat.name, 'total': stat.cases?.total, 'active': stat.cases?.active, 'recovered': stat.cases?.recovered
    }))
    countriesTotalCases = [...countriesTotalCases.sort((a, b) => b.total - a.total)]
    this.affectedCountries = countriesTotalCases.slice(0, 5);
    this.populateBarChartData()
  }

  populateBarChartData() {
    let labels: string[] = [];
    let totalCases: number[] = [];
    let activeCases: number[] = [];
    let recoveredCases: number[] = [];
    this.affectedCountries.forEach(country => {
      labels.push(country.name)
      totalCases.push(country.total)
      activeCases.push(country.active)
      recoveredCases.push(country.recovered)
    })
   this.barChartData = {
      labels: labels,
      datasets: [
        { data: totalCases, 
          label: 'Total Cases',
          backgroundColor: '#990052' },
        { data: activeCases, 
          label: 'Active Cases',
          backgroundColor: '#ff99cf' },
        { data: recoveredCases, 
          label: 'Recovered Cases',
          backgroundColor: '#3fb57e' }
      ]
    };
  }
  
}
