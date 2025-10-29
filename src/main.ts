
import {bootstrapApplication} from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import {provideRouter} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app/app';
import { routes } from './app/app.routes';

// Tornamos HttpClient disponível para serviços injetáveis em componentes standalone
bootstrapApplication(AppComponent, {
		providers: [
				provideRouter(routes),
				importProvidersFrom(HttpClientModule)
		]
}).catch((err) =>
	console.error(err),
);
