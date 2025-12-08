import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../services/post.services/post.services';

@Component({
	selector: 'app-post-card',
	standalone: true,
	imports: [CommonModule],
	template: `
		<article class="post-card flex flex-col rounded-lg overflow-hidden w-100">
			<div class="post-image-container">
				<img [src]="post?.image || 'assets/nova-malpetrim.jpg'" [alt]="post?.title || 'Imagem do Post'" class="post-image rounded-lg w-full object-cover">
			</div>
		<div class="post-meta flex justify-between items-center text-sm text-gray-500 my-2">
			<div class="flex items-center gap-2">
				<span class="post-category py-1 px-8 bg-gray-300 rounded-sm">
					{{ post?.categories?.[0]?.nome || 'Sem categoria' }}
				</span>
				<span *ngIf="getExtraCategoriesCount() > 0" 
					class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
					+{{ getExtraCategoriesCount() }}
				</span>
			</div>
			<div class="post-info flex space-x-1">
				<span class="post-date">{{ formatDate(post?.createdAt) }}</span>
				<span *ngIf="post">•</span>
				<span class="read-time">{{ '1 min' }}</span>
			</div>
		</div>
			<div class="post-content">
				<h3 class="text-2xl line-clamp-2">{{ post?.title }}</h3>
				<p class="excerpt line-clamp-3">{{ post?.excerpt }}</p>
			</div>
		<div class="post-author flex items-center mt-4 space-x-2">
			<img [src]="post?.author?.profilePhoto || 'assets/nova-malpetrim.jpg'" alt="Foto do Autor" class="author-image rounded-full w-8 h-8">
		<div class="author-info flex flex-col">
			<span class="author-name text-sm font-bold">{{ post?.author?.name || 'Autor' }}</span>
			<span class="author-role text-sm/5 text-gray-400">{{ post?.author?.title || 'Escritor' }}</span>
		</div>
		</div>
		</article>
	`,
	styles: `
		.post-card h3 { font-family: 'DM Serif Display', serif; }
		.post-card p, .post-meta, .post-category, .post-info, .post-date, .read-time, .author-name {
			font-family: 'DM Sans', sans-serif;
		}
		.post-image-container {
			height: 245px;
			overflow: hidden;
		}
		.post-content .excerpt {
			margin-top: 0.5rem;
			color: #4b5563; /* gray-600 */
			min-height: 5rem; /* approximately 3 lines */
		}
		.post-image {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
		.author-image {
			width: 32px;
			height: 32px;
			object-fit: cover;
		}
		.post-category {
			font-family: 'DM Sans', sans-serif;
			font-weight: 500;
			font-size: 0.875rem; /* text-sm */
		}
		.post-meta {
			font-size: 0.875rem; /* text-sm */
		}
	`
})
export class PostCardComponent {
	@Input() post?: Post;

	getExtraCategoriesCount(): number {
		if (!this.post?.categories || this.post.categories.length <= 1) {
			return 0;
		}
		return this.post.categories.length - 1;
	}

	formatDate(dateString?: string): string {
		if (!dateString) return '';
		
		const date = new Date(dateString);
		const months = [
			'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
			'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
		];
		
		const day = date.getDate();
		const month = months[date.getMonth()];
		const year = date.getFullYear();
		
		return `${day} de ${month}, ${year}`;
	}
}
