import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgApexchartsModule } from 'ng-apexcharts';

import { MapComponent } from './map/map.component';
import { CountryService } from './shared/country.service';
import { KeyInterceptor } from './shared/key.interceptor';
import { CountrySelectComponent } from './country-select/country-select.component';
import { StatsService } from './shared/stats.service';
import { StatsComponent } from './stats/stats.component';
import { HistoryComponent } from './history/history.component';
import { TopNavComponent } from './top-nav/top-nav.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    CountrySelectComponent,
    StatsComponent,
    HistoryComponent,
    TopNavComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,    
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    NgApexchartsModule,
  ],
  providers: [
    CountryService,
    StatsService,     
    { provide: HTTP_INTERCEPTORS, useClass: KeyInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
