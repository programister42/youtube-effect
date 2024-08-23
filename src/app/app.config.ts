import {
	type ApplicationConfig,
	provideExperimentalZonelessChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
	providers: [
		provideExperimentalZonelessChangeDetection(),
		provideRouter(routes),
		// hydration is not yet fully supported with zoneless change detection
		// provideClientHydration(),
	],
};
