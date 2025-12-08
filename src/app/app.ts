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
    <app-header *ngIf="!isAdminRoute && !isAuthRoute"></app-header>
		<app-hero *ngIf="showHero && !isAdminRoute && !isAuthRoute"></app-hero>
		<main [class.admin-layout]="isAdminRoute">
			<router-outlet></router-outlet>
		</main>
		<app-footer *ngIf="!isAdminRoute && !isAuthRoute"></app-footer>
  `,
  styleUrls: ['./app.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Forja dos Narradores';
  showHero = true;
  isAdminRoute = false;
  isAuthRoute = false;

  private sub: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Detecta se está em área admin, auth ou em detalhes de post
    this.sub = this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((ev) => {
      const url = ev.urlAfterRedirects || ev.url;
      
      // Detecta se é rota admin
      this.isAdminRoute = url.startsWith('/admin');
      
      // Detecta se é rota de autenticação
      this.isAuthRoute = url.startsWith('/auth');
      
      // Esconde hero se for /blog/:id (mas não afeta admin ou auth, pois já escondem tudo)
      this.showHero = !/^\/blog\/[^/]+/.test(url);
    });
    
    // Checagem inicial
    const initialUrl = this.router.url || '';
    this.isAdminRoute = initialUrl.startsWith('/admin');
    this.isAuthRoute = initialUrl.startsWith('/auth');
    this.showHero = !/^\/blog\/[^/]+/.test(initialUrl);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
