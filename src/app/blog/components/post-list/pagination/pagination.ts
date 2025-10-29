import { Component } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  template: `
    <section class="pagination flex justify-center my-4">
			<button class="px-4 py-2 mx-1 bg-gray-200 rounded hover:bg-gray-300">Anterior</button>
			<button class="px-4 py-2 mx-1 bg-gray-200 rounded hover:bg-gray-300">1</button>
			<button class="px-4 py-2 mx-1 bg-gray-200 rounded hover:bg-gray-300">2</button>
			<button class="px-4 py-2 mx-1 bg-gray-200 rounded hover:bg-gray-300">3</button>
			<button class="px-4 py-2 mx-1 bg-gray-200 rounded hover:bg-gray-300">4</button>
			<button class="px-4 py-2 mx-1 bg-gray-200 rounded hover:bg-gray-300">Próximo</button>
		</section>
  `,
  styles: ``
})
export class PaginationComponent {

}
