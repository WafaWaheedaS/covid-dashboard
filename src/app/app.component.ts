import { Component, OnInit } from '@angular/core';
import { CountryService } from './shared/country.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'covid-dashboard';
  countriesList: any;
  constructor(
    private countryService: CountryService
    ){}

  ngOnInit(): void {
    this.getCountries()
  }

  getCountries(): void {
    this.countryService.getAll().subscribe((countries) => {
      this.countriesList = countries;
    })
  }
}
