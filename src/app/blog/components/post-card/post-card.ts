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
				<span class="post-category py-1 px-8 bg-gray-300 rounded-sm">{{ post?.category || 'Categoria' }}</span>
				<div class="post-info flex space-x-1">
					<span class="post-date">{{ post?.date || '' }}</span>
					<span *ngIf="post">•</span>
					<span class="read-time">{{ post?.readTime || '' }}</span>
				</div>
			</div>
			<div class="post-content">
				<h3 class="text-2xl line-clamp-2">{{ post?.title }}</h3>
				<p class="line-clamp-3">{{ post?.content }}</p>
			</div>
			<div class="post-author flex items-center mt-4 space-x-2">
				<img [src]="post?.image || 'assets/nova-malpetrim.jpg'" alt="Foto do Autor" class="author-image rounded-full w-8 h-8">
				<div class="author-info flex flex-col">
					<span class="author-name text-sm font-bold">{{ post?.author || 'Autor' }}</span>
					<span class="author-role text-sm/5 text-gray-400">Desenvolvedor & Community Expert</span>
				</div>
			</div>
		</article>
	`,
	styles: `
		.post-card h3 { font-family: 'DM Serif Display', serif; }
		.post-card p, .post-meta, .post-category, .post-info, .post-date, .read-time, .author-name {
			font-family: 'DM Sans', sans-serif;
		}
	`
})
export class PostCardComponent {
	@Input() post?: Post;
}
