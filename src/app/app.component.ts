import { Component, OnInit } from '@angular/core';
import { MainComponent } from './main/main.component';
import { PrimeNG } from 'primeng/config';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [MainComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

    constructor(private primeng: PrimeNG) {}

    ngOnInit() {
        this.primeng.ripple.set(true);
    }

  title = 'benefit-report';
}
