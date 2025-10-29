import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  imports: [],
  template: `
    <section class="forja-hero flex bg-gray-100 py-20 px-4 flex-col md:flex-row
		 items-center justify-evenly space-y-8 md:space-y-0 md:space-x-10 z-8">
			<div class="container px-4 text-center">
				<h2 class="text-5xl mb-4 text-left">A Faísca da Sua História</h2>
				<p class="text-xl mb-8 text-left w-130">Nos bastidores de todo jogo de sucesso, existe um grupo de narradores dedicados,
				de criadores que transformaram uma simples ideia em uma lenda. Na Forja dos Narradores, investigamos o fenômeno
				dos jogos de mesa que se tornaram virais, dissecando a faísca que acendeu a paixão de milhões.</p>
			</div>
			<div class="forja-hero-image mt-2 size-auto">
				<img src="assets/lua-hero.png" alt="Imagem Hero" class="w-3/4"/>
			</div>
		</section>
  `,
  styles: `
	.forja-hero { height: 350px; }
	.forja-hero h2 { font-family: 'DM Serif Display', serif; }
	.forja-hero p { font-family: 'DM Sans', sans-serif; }
	.forja-hero div.container {
		max-width: 600px;
	}
	.forja-hero-image img {
		margin-top: 220px;
		max-width: 500px;
	}
	`
})
export class HeroComponent {

}
