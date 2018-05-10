import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { CountryViewComponent } from './country-view/country-view.component';
import { CityViewComponent } from './citt-view/city-view.component';
import { ApiService } from './services/apiService';
  
const SHARED = [
  HeaderComponent,
]

const COMPONENTS = [
  AppComponent,
  CountryViewComponent,
  CityViewComponent
]

const NG_MODULE_IMPORTS = [
  BrowserModule,
  AppRoutingModule,
  Ng2SmartTableModule,
  HttpClientModule,
  FormsModule,
  CommonModule,
  ReactiveFormsModule
]

const SERVICES = [
  ApiService,
]

@NgModule({
  declarations: [
    COMPONENTS,
    SHARED,
  ],
  imports: [
    NG_MODULE_IMPORTS,
  ],
  providers: [
    SERVICES,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
