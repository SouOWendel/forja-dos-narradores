import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './shared/components/header/header';
import { HeroComponent } from './shared/components/hero/hero';
import { FooterComponent } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [CommonModule, RouterOutlet, HeaderComponent, HeroComponent, FooterComponent],
  template: `
    <app-header></app-header>
		<app-hero *ngIf="showHero"></app-hero>
		<main>
			<router-outlet></router-outlet>
		</main>
		<app-footer></app-footer>
  `,
  styleUrls: ['./app.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Forja dos Narradores';
  showHero = true;

  private sub: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Esconde o hero quando a rota for /blog/:id (detalhe)
    this.sub = this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((ev) => {
      // Se a URL começar com /blog/ seguido de algo (ex.: /blog/1), escondemos o hero
      const url = ev.urlAfterRedirects || ev.url;
      this.showHero = !/^\/blog\/[^/]+/.test(url);
    });
    // também faz uma checagem inicial
    const initialUrl = this.router.url || '';
    this.showHero = !/^\/blog\/[^/]+/.test(initialUrl);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
