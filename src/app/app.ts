import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header';
import { HeroComponent } from './shared/components/hero/hero';
import { FooterComponent } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, HeroComponent, FooterComponent],
  template: `
    <app-header></app-header>
		<app-hero></app-hero>
		<main>
			<router-outlet></router-outlet>
		</main>
		<app-footer></app-footer>
  `,
  styleUrls: ['./app.css'],
})
export class AppComponent {
  title = 'Forja dos Narradores';
}
