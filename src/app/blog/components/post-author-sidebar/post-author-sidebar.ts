import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-post-author-sidebar',
	standalone: true,
	imports: [CommonModule],
  template: `
    <aside class="p-4 rounded-md mb-6 mt-8 md:sticky md:top-16 md:w-64">
		<div class="flex">
			<img src="assets/nova-malpetrim.jpg" alt="Avatar do Autor" class="w-15 h-15 rounded-full mb-2">
			<div class="ml-4 flex flex-col">
				<span class="text-md font-bold mb-2">{{ authorName }}</span>
				<span class="text-xs text-gray-700">{{ authorTitle }}</span>
			</div>
		</div>
		<div class="forja-author-bio mt-4">
			<h3 class="text-md font-bold mb-2">Sobre o Narrador.</h3>
			<p class="text-sm text-gray-600 hyphens-auto">{{ authorBio }}</p>
		</div>
		<div class="forja-author-social mt-4 flex">
			<a href="{{ socialLinks.twitter }}" class="text-gray-700 hover:text-gray-900">Twitter</a>
			<a href="{{ socialLinks.github }}" class="text-gray-700 hover:text-gray-900">GitHub</a>
			<a href="{{ socialLinks.linkedin }}" class="text-gray-700 hover:text-gray-900">LinkedIn</a>
		</div>
		<div class="forja-post-resume mt-4">
			<h3 class="text-md font-bold mb-2">Sobre esta postagem.</h3>
			<p class="text-sm text-gray-600 hyphens-auto">{{ postResume }}</p>
		</div>
	</aside>
  `,
  styles: ``
})
export class PostAuthorSidebar {
	// Aqui você pode adicionar lógica ou propriedades específicas para a barra lateral do autor do post
	authorName: string = 'Wendel Henrique';
	authorImage: string = 'assets/nova-malpetrim.jpg';
	authorTitle: string = 'Desenvolvedor & Community Expert';
	authorBio: string = `Meu nome é Wendel e sou o artesão por trás da Forja dos Narradores. Como programador em
	 início de carreira e, acima de tudo, um apaixonado por RPG de mesa, encontrei nesta jornada a minha
	  "forja". É aqui que uno minhas duas paixões, "forjando" tanto aventuras épicas quanto linhas de código
		 que dão vida a ferramentas para nossos jogos.`;
	postResume: string = `Nesta postagem, exploramos as mecânicas colaborativas em RPG de mesa, destacando como a
	 participação ativa dos jogadores pode enriquecer a narrativa e criar experiências memoráveis.`;
	socialLinks = {
		twitter: '#',
		github: '#',
		linkedin: '#'
	};
}
