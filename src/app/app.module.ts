import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { CountryService } from './shared/country.service';
import { KeyInterceptor } from './shared/key.interceptor';

import { CountrySelectComponent } from './country-select/country-select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    CountrySelectComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,    
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatToolbarModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  providers: [
    CountryService,     
    { provide: HTTP_INTERCEPTORS, useClass: KeyInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
