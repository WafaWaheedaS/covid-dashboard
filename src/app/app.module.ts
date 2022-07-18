import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { CountryService } from './shared/country.service';
import { KeyInterceptor } from './shared/key.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [CountryService,     { provide: HTTP_INTERCEPTORS, useClass: KeyInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
