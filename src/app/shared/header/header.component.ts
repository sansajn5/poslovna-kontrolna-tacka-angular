import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {

    constructor(private router: Router) {}

    onCountry() {
        this.router.navigateByUrl('/country')
    }

    onCity() {
        this.router.navigateByUrl('/country/0')
    }
}