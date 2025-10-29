import { Component } from '@angular/core';

@Component({
  selector: 'app-post-card',
  imports: [],
  template: `
    <article class="post-card flex flex-col rounded-lg overflow-hidden w-100">
			<div class="post-image-container">
				<img src="assets/nova-malpetrim.jpg" alt="Imagem do Post" class="post-image rounded-lg w-full object-cover">
			</div>
			<div class="post-meta flex justify-between items-center text-sm text-gray-500 my-2">
				<span class="post-category py-1 px-8 bg-gray-300 rounded-sm">Categoria</span>
				<div class="post-info flex space-x-1">
					<span class="post-date">27 de Outubro, 2025</span>
					<span>•</span>
					<span class="read-time">5 min</span>
				</div>
			</div>
			<div class="post-content">
				<h3 class="text-2xl line-clamp-2">Ascensão dos Aventureiros: Um Olhar Sobre os Jogos Narrativos Mais Bem-Sucedidos do Ano e Seus Devs</h3>
				<p class="line-clamp-3">Uma investigação sobre o fenômeno dos jogos de mesa que se tornaram virais,
				 e uma entrevista exclusiva com os criadores sobre a jornada de desenvolvimento por trás do sucesso.</p>
			</div>
			<div class="post-author flex items-center mt-4 space-x-2">
				<img src="assets/nova-malpetrim.jpg" alt="Foto do Autor" class="author-image rounded-full w-8 h-8">
				<div class="author-info flex flex-col">
					<span class="author-name text-sm font-bold">Wendel Henrique</span>
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

}
