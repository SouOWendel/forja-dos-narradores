import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../../auth/services/auth.service';
import { Observable } from 'rxjs';

/**
 * AdminLayoutComponent
 * - Layout wrapper para área administrativa
 * - Sidebar com navegação
 * - Header admin separado
 */
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-container">
      <!-- Sidebar -->
      <aside class="admin-sidebar">
        <div class="sidebar-header">
          <h2 class="text-xl font-bold text-white">Painel Admin</h2>
          <p class="text-gray-300 text-sm mt-1">Forja dos Narradores</p>
        </div>

        <nav class="sidebar-nav">
          <a 
            routerLink="/admin/posts" 
            routerLinkActive="active"
            class="nav-item">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Postagens</span>
          </a>

          <a 
            routerLink="/admin/posts/new" 
            routerLinkActive="active"
            class="nav-item">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Nova Postagem</span>
          </a>

          <div class="nav-divider"></div>

          <a 
            routerLink="/" 
            class="nav-item">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Voltar ao Site</span>
          </a>

          <button 
            (click)="logout()"
            class="nav-item text-red-300 hover:bg-red-900 hover:text-white w-full text-left">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sair</span>
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <div class="admin-content">
        <!-- Top Bar -->
        <header class="admin-header">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-semibold text-gray-800">Dashboard</h1>
            <div class="flex items-center gap-4" *ngIf="currentUser$ | async as user">
              <span class="text-sm text-gray-600">{{ user.name }}</span>
              <img 
                *ngIf="user.profilePhoto; else avatarFallback"
                [src]="user.profilePhoto" 
                [alt]="user.name"
                class="w-8 h-8 rounded-full object-cover">
              <ng-template #avatarFallback>
                <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
              </ng-template>
            </div>
          </div>
        </header>

        <!-- Content Area -->
        <div class="admin-main">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      display: flex;
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    /* Sidebar */
    .admin-sidebar {
      width: 260px;
      background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
      color: white;
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100vh;
      left: 0;
      top: 0;
      z-index: 100;
    }

    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      color: #cbd5e1;
      text-decoration: none;
      transition: all 0.2s;
      margin-bottom: 0.25rem;
      cursor: pointer;
      border: none;
      background: transparent;
      font-size: 0.95rem;
    }

    .nav-item:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .nav-item.active {
      background-color: #3b82f6;
      color: white;
      font-weight: 500;
    }

    .nav-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
      margin: 1rem 0;
    }

    /* Content Area */
    .admin-content {
      flex: 1;
      margin-left: 260px;
      display: flex;
      flex-direction: column;
    }

    .admin-header {
      background: white;
      padding: 1.5rem 2rem;
      border-bottom: 1px solid #e5e7eb;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .admin-main {
      flex: 1;
      padding: 2rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .admin-sidebar {
        width: 70px;
      }

      .admin-sidebar .sidebar-header h2,
      .admin-sidebar .sidebar-header p,
      .admin-sidebar .nav-item span {
        display: none;
      }

      .admin-content {
        margin-left: 70px;
      }
    }
  `]
})
export class AdminLayoutComponent implements OnInit {
  currentUser$: Observable<User | null>;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    // Componente inicializado
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
