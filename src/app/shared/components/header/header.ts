import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  template: `
    <header class="flex justify-between items-center p-2 px-5 shadow-mdbg-white z-10">
			<h1 class="text-3xl">{{ blogTitle }}</h1>
			<div class="relative">
				<svg class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
				xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"/>
				</svg>
				<input type="text" placeholder="Em busca de um dragão? Ou um feitiço?" 
				class="forja-search p-2 rounded-full border w-100 border-gray-200 placeholder-gray-400 pl-10" />
			</div>
			<div class="space-x-2">
				<button class="text-black px-4 py-2 rounded" (click)="onLoginClick()">Adentrar na Guilda</button>
				<button class="bg-gray-900 text-white px-4 py-2 rounded-xl">Fazer Registro</button>
			</div>
		</header>
  `,
  styles: `
		h1 { font-family: 'DM Serif Display', serif; }
		.forja-search {
			width: 525px;
		}
	`
})
export class HeaderComponent {
	blogTitle = 'Forja dos Narradores';
	onLoginClick() {
		console.log('Botão de login clicado!');
	}
}
