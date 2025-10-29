import { Routes } from '@angular/router';
export const routes: Routes = [
	// Defina suas rotas principais aqui
	{ path: 'auth', loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes) },
	{ path: '', loadChildren: () => import('./blog/blog.routes').then(m => m.blogRoutes) },
	{ path: '', redirectTo: 'blog', pathMatch: 'full' },
	//{ path: 'admin', loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes) }
];