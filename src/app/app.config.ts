import {
	type ApplicationConfig,
	provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideTrpcClient } from './providers/trpc-client';

export const appConfig: ApplicationConfig = {
	providers: [
		provideExperimentalZonelessChangeDetection(),
		provideRouter(routes),
		provideHttpClient(withFetch()),
		provideAnimationsAsync(),
		provideTrpcClient(),
		// hydration is not yet fully supported with zoneless change detection
		// provideClientHydration(),
	],
};
