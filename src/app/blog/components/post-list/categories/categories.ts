import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService, Category } from '../../../services/post.services/post.services';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="forja-categories mb-4">
			<h2 class="text-3xl mb-2">Explore por Categoria</h2>
			<ul class="flex space-x-4 mt-6 gap-5 flex-wrap">
				<li class="category-item">
					<button 
						(click)="selectCategory(null)" 
						[class.active]="selectedCategory === null"
						class="category-link">
						Todas
					</button>
				</li>
				<li class="category-item" *ngFor="let cat of categories">
					<button 
						(click)="selectCategory(cat.slug)" 
						[class.active]="selectedCategory === cat.slug"
						class="category-link">
						{{ cat.nome }}
					</button>
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
			background: none;
			border: none;
			cursor: pointer;
			padding: 0.5rem 1rem;
			border-radius: 0.375rem;
			font-family: 'DM Sans', sans-serif;
			transition: all 0.2s;
		}
		.forja-categories .category-link:hover {
			background-color: #f3f4f6;
		}
		.forja-categories .category-link.active {
			background-color: #1a202c;
			color: white;
			font-weight: bold;
		}
	`
})
export class Categories implements OnInit {
  // Lista de categorias carregadas do banco de dados
  categories: Category[] = [];

  // Categoria atualmente selecionada (null = todas, string = slug da categoria)
  selectedCategory: string | null = null;

  // Evento que emite a categoria selecionada para o componente pai
  @Output() categorySelected = new EventEmitter<string | null>();

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    // Carrega categorias do banco de dados
    this.postService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias', err);
      }
    });
  }

  selectCategory(categorySlug: string | null): void {
    this.selectedCategory = categorySlug;
    this.categorySelected.emit(categorySlug);  // Emite slug para o pai
  }
}
