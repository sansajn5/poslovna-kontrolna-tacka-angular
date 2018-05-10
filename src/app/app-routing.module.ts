
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { CountryViewComponent } from './country-view/country-view.component';
import { CityViewComponent } from './citt-view/city-view.component';

const routes : Routes = [
    { path: '' , component: CountryViewComponent },
    { path: 'country', component: CountryViewComponent },
    { path: 'country/:mark', component: CityViewComponent },
    { path: '**', redirectTo: 'country'},
]

const config: ExtraOptions = {
    useHash: true,
  };

@NgModule({
    imports: [RouterModule.forRoot(routes, config)],
    exports: [RouterModule],
})

export class AppRoutingModule {
}