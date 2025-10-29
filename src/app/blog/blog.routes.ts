import { Routes } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list';
import { PostDetailComponent } from './pages/post-detail/post-detail';

export const blogRoutes: Routes = [
	{ path: 'blog', component: PostListComponent },
	{ path: 'blog/:id', component: PostDetailComponent },
	{ path: '', redirectTo: 'blog', pathMatch: 'full' }
];