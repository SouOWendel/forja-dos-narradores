import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { PostManagementComponent } from './pages/post-management/post-management';
import { PostFormComponent } from './pages/post-form/post-form';
import { AuthGuard } from '../auth/guards/auth.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],  // Protege todas as rotas admin
    data: { requiresAdmin: true },  // Requer usuário admin
    children: [
      {
        path: '',
        redirectTo: 'posts',
        pathMatch: 'full'
      },
      {
        path: 'posts',
        component: PostManagementComponent,
        title: 'Gerenciar Postagens'
      },
      {
        path: 'posts/new',
        component: PostFormComponent,
        title: 'Nova Postagem'
      },
      {
        path: 'posts/edit/:id',
        component: PostFormComponent,
        title: 'Editar Postagem'
      }
    ]
  }
];
