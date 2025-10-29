import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-post-counter',
	standalone: true,
	imports: [CommonModule],
	template: `
		<div class="forja-post-icons mt-8 md:sticky md:top-16 flex justify-center items-center flex-col relative">
			<button
				class="flex justify-center items-center font-bold rounded-full border border-gray-300 p-4 m-4 h-10 w-10 bg-white select-none"
				(click)="onLeftClick($event)"
				(contextmenu)="onRightClick($event)">
				{{ eventCounter }}
			</button>

			<!-- keep popup in DOM so we can animate with CSS transitions -->
			<div class="popup px-2.5 py-0.5 bg-white shadow-md" [class.popup--visible]="popupVisible">
				{{ popupMessage }}
			</div>
		</div>
	`,
	styles: `
		.forja-post-icons button {
			font-family: 'DM Sans', serif;
			cursor: pointer;
			user-select: none;
		}
		.forja-post-icons button:hover {
			background-color: #f3f4f6;
		}
		.forja-post-icons button:active {
			background-color: #e5e7eb;
		}
		.popup {
			position: absolute;
			top: -1rem;
			right: 0rem;
			border: 1px solid rgba(0, 0, 0, 0.08);
			border-radius: 6px;
			font-size: 0.9rem;
			/* start hidden, slightly below */
			opacity: 0;
			transform: translateY(8px);
			transition: opacity 0.28s cubic-bezier(.2,.9,.2,1), transform 0.28s cubic-bezier(.2,.9,.2,1);
			pointer-events: none;
		}

		/* visible state: fade in and slide up */
		.popup--visible {
			opacity: 1;
			transform: translateY(-6px);
		}
	`
})
export class PostCounter {
	eventCounter = 1;

	// soma dos cliques "adicionados" (left clicks)
	addedSum = 0;

	// popup state
	popupVisible = false;
	popupMessage = '';
	private popupTimeout: any;

	onLeftClick(e: MouseEvent) {
		// left click increments
		this.eventCounter++;
		this.addedSum += 1;
		this.showPopup(`${this.addedSum}`);
	}

	onRightClick(e: MouseEvent) {
		// prevent context menu
		e.preventDefault();
		this.eventCounter--;
		this.addedSum -= 1;
		// show popup with current added sum as feedback as well
		this.showPopup(`${this.addedSum}`);
	}

	private showPopup(message: string) {
		this.popupMessage = message;
		this.popupVisible = true;
		clearTimeout(this.popupTimeout);
		// keep popup visible for a moment, then trigger hide (it will animate)
		this.popupTimeout = setTimeout(() => {
			this.popupVisible = false;
			this.addedSum = 0;
			// optionally clear message after animation duration to avoid stale text; keep a small delay
			setTimeout(() => (this.popupMessage = ''), 320);
		}, 1800);
	}
}