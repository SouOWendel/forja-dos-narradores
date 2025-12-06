import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="forja-categories mb-4">
			<h2 class="text-3xl mb-2">Últimas Publicações</h2>
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
						(click)="selectCategory(cat)" 
						[class.active]="selectedCategory === cat"
						class="category-link">
						{{ cat }}
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
export class Categories {
  // Lista de categorias disponíveis (deve corresponder às categorias do banco)
  categories = [
    'Teoria Narrativa',
    'Worldbuilding',
    'Técnica',
    'Estrutura',
    'Personagens'
  ];

  // Categoria atualmente selecionada (null = todas)
  selectedCategory: string | null = null;

  // Evento que emite a categoria selecionada para o componente pai
  @Output() categorySelected = new EventEmitter<string | null>();

  selectCategory(category: string | null): void {
    this.selectedCategory = category;
    this.categorySelected.emit(category);  // Emite evento para o pai
  }
}
