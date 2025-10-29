import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-comment-list',
	standalone: true,
	imports: [CommonModule],
	template: `
		<aside class="mt-8 md:sticky md:top-16 md:w-64">
			<h2 class="text-2xl font-bold mb-4">Comentários {{ commentsCount }}</h2>
			<div *ngFor="let comment of comments" class="mb-4 p-4 border border-gray-300 rounded-md">
				<div class="flex justify-start items-center mb-2 gap-2">
					<img src="assets/nova-malpetrim.jpg" alt="Avatar do Comentador" class="w-5 h-5 rounded-full object-cover">
					<p class="font-bold text-sm">{{ comment.author }}</p>
					<span class="text-xs text-gray-500">{{ comment.timestamp }}</span>
				</div>
				<p class="text-sm">{{ comment.content }}</p>
			</div>
		</aside>
	`,
  styles: ``
})
export class CommentList {
	comments = [
		{ author: 'Alice', content: 'Ótimo post!', timestamp: 'há 2 horas' },
		{ author: 'Bob', content: 'Muito informativo, obrigado!', timestamp: 'há 3 horas' },
		{ author: 'Charlie', content: 'Adorei a parte sobre mecânicas colaborativas.', timestamp: 'há 1 dia' }
	];
	commentsCount = this.comments.length;
}
