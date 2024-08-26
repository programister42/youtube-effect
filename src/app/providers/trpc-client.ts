import { inject, InjectionToken, Provider } from '@angular/core';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '../../server';
import { API_PATH } from '../constants/api-path';

const client = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: API_PATH,
		}),
	],
});

export const TrpcClient = new InjectionToken<typeof client>('TRPC_CLIENT');

export const provideTrpcClient = (): Provider => ({
	provide: TrpcClient,
	useValue: client,
});

export const injectTrpcClient = (): typeof client => inject(TrpcClient);
