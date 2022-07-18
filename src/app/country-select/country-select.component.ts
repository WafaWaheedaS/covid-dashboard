import { Component, OnInit } from '@angular/core';
import { CountryService } from '../shared/country.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Country } from '../shared/country.model';
import * as countryCodeLookup from 'country-code-lookup';

@Component({
  selector: 'covid-country-select',
  templateUrl: './country-select.component.html',
  styleUrls: ['./country-select.component.css']
})
export class CountrySelectComponent implements OnInit {
  constructor(
    private countryService: CountryService
    ){}
    
  countriesList: string[] = [];
  selectedItems: Country[] = [];
  dropdownSettings: IDropdownSettings = {};

  ngOnInit(): void {
    this.getCountries()

    this.dropdownSettings = {
      singleSelection: false,
      enableCheckAll: false,
      itemsShowLimit: 3,
      limitSelection: 1,
      allowSearchFilter: true
    };
  }

  onItemSelect(item: any) {
    let country: Country = { 'name': item, 'id': countryCodeLookup.byCountry(item)?.fips }
    this.selectedItems.push(country)
  }

  getCountries(): void {
    const countries = localStorage.getItem('countries')
    if(countries)
      this.countriesList = JSON.parse(countries).map((country: Country) => country.name);
    else this.countryService.getAll().subscribe((countries) => {
      this.countriesList = countries.map((country: Country) => country.name);
    })
  }

}
