import { Component } from '@angular/core';

@Component({
  selector: 'app-categories',
  imports: [],
  template: `
    <div class="forja-categories mb-4">
			<h2 class="text-3xl mb-2">Postagens Recentes</h2>
			<ul class="flex space-x-4 mt-6 gap-5 flex-wrap">
				<li class="category-item">
					<a href="#" class="category-link">Notícias Recentes</a>
				</li>
				<li class="category-item">
					<a href="#" class="category-link">Ferramentas Digitais</a>
				</li>
				<li class="category-item">
					<a href="#" class="category-link">Sistemas de RPG</a>
				</li>
				<li class="category-item">
					<a href="#" class="category-link">Dicas para Jogar</a>
				</li>
				<li class="category-item">
					<a href="#" class="category-link">Inspirações para Histórias</a>
				</li>
			</ul>
		</div>
  `,
  styles: `
		.forja-categories h2 {
			font-family: 'DM Serif Display', serif;
		}
		.forja-categories .category-link {
			color: #1a202c;
			text-decoration: none;
			font-family: 'DM Sans', sans-serif;
		}
		.forja-categories .category-link:hover {
			font-weight: bold;
		}
	`
})
export class Categories {

}
