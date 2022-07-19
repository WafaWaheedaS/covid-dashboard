import { Component, OnInit, ViewChild } from '@angular/core';
import { CountryService } from '../shared/country.service';
import { Country } from '../shared/model';
import * as countryCodeLookup from 'country-code-lookup';
import { defaultSelectedCountry } from '../app.constants';
import { UntypedFormControl } from '@angular/forms';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'covid-country-select',
  templateUrl: './country-select.component.html',
  styleUrls: ['./country-select.component.css'],
})
export class CountrySelectComponent implements OnInit {
  constructor(
    private countryService: CountryService
  ) { }

  countriesList: string[] = [];
  selectedCountry: Country[] = [defaultSelectedCountry];

  public countryCtrl: UntypedFormControl = new UntypedFormControl();
  public countryFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredCountries: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
  @ViewChild('countrySelect', { static: true }) countrySelect!: MatSelect;
  _onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.getCountries()
    this.filteredCountries.next(this.countriesList.slice());

    this.countryService.getSelectedCountry()
      .pipe(take(1))
      .subscribe((country: Country) => this.countryCtrl.setValue(country.name))

    this.countryFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCountries();
      });

    this.countryCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => this.onCountrySelect())
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected setInitialValue() {
    this.filteredCountries
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.countrySelect.compareWith = (a, b) => a && b && a === b;
      });
  }

  protected filterCountries() {
    if (!this.countriesList) {
      return;
    }
    let search = this.countryFilterCtrl.value;
    if (!search) {
      this.filteredCountries.next(this.countriesList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCountries.next(
      this.countriesList.filter(country => country.toLowerCase().indexOf(search) > -1)
    );
  }

  onCountrySelect() {
    let selectedCountry = this.countryCtrl.value;
    let country: Country = { 'name': selectedCountry, 'id': countryCodeLookup.byCountry(selectedCountry)?.fips }
    this.selectedCountry.push(country)
    this.countryService.setSelectedCountry(country)
  }

  getCountries(): void {
    const countries = localStorage.getItem('countries')
    if (countries)
      this.countriesList = JSON.parse(countries).map((country: Country) => country.name);
    else this.countryService.getAll().subscribe((countries) => {
      this.countriesList = countries.map((country: Country) => country.name);
    })
  }

}
