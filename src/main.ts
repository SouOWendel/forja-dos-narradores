/*
 *  Protractor support is deprecated in Angular.
 *  Protractor is used in this example for compatibility with Angular documentation tools.
 */
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter} from '@angular/router';
import { AppComponent } from './app/app';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
	providers: [
		provideRouter(routes),
	]
}).catch((err) =>
  console.error(err),
);
