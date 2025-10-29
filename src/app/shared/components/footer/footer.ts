import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  template: `
    <footer class="bg-white border-t border-gray-300 py-10 mt-8 pb-30">
			<div class="container mx-auto flex flex-col md:flex-row md:justify-evenly">
				<section class="w-40 mb-4 md:mb-0">
					<p>&copy; 2025 Forja dos Narradores. Todos os direitos reservados.</p>
				</section>
				<section class="flex flex-col space-y-2">
					<h4 class="font-bold mb-8">Legal</h4>
					<a href="#" class="hover:underline">Política de Privacidade</a>
					<a href="#" class="hover:underline">Termos de Serviço</a>
					<a href="#" class="hover:underline">Contato</a>
				</section>
				<section class="flex flex-col space-y-2 mt-4 md:mt-0">
				<h4 class="font-bold mb-8">Redes Sociais</h4>
					<a href="#" class="hover:underline">Facebook</a>
					<a href="#" class="hover:underline">Twitter</a>
					<a href="#" class="hover:underline">Instagram</a>
				</section>
				<section class="flex flex-col space-y-2 mt-4 md:mt-0">
					<h4 class="font-bold mb-8">Links Úteis</h4>
					<a href="#" class="hover:underline">YouTube</a>
					<a href="#" class="hover:underline">Twitch</a>
				</section>
			</div>
		</footer>
  `,
  styles: `
		footer p, footer a { font-family: 'DM Sans', sans-serif; }
	`
})
export class FooterComponent {

}
