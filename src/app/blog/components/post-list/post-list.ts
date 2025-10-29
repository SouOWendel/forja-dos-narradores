import { Component } from '@angular/core';
import { PostCardComponent } from '../post-card/post-card';
import { Categories } from './categories/categories';
import { PaginationComponent } from './pagination/pagination';

@Component({
  selector: 'app-post-list',
  imports: [PostCardComponent, Categories, PaginationComponent],
  template: `
	<section class="container mx-auto p-4">
		<app-categories></app-categories>
		<hr class="my-4 border-gray-300" />
    <section class="post-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 py-4 mb-8">
      <app-post-card></app-post-card>
      <app-post-card></app-post-card>
      <app-post-card></app-post-card>
			<app-post-card></app-post-card>
      <app-post-card></app-post-card>
      <app-post-card></app-post-card>
    </section>
		<app-pagination></app-pagination>
	</section>
  `,
  styles: ``
})
export class PostListComponent {

}
