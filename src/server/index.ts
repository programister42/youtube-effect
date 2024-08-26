import { z } from 'zod';
import { youtube } from '@googleapis/youtube';
import { publicProcedure, router } from './trpc';

const youtubeApi = youtube({
	version: 'v3',
	auth: process.env['YOUTUBE_API_KEY'] as string,
});

export const appRouter = router({
	searchVideos: publicProcedure
		.input(
			z.object({
				q: z.string(),
				count: z.number(),
			}),
		)
		.query(async (opts) => {
			const { q, count } = opts.input;

			const videosResponse = await youtubeApi.search.list({
				q,
				part: ['snippet'],
				type: ['video'],
				maxResults: Number(count),
			});

			const videos =
				videosResponse.data.items?.map((item) => ({
					id: item.id?.videoId ?? '',
					title: item.snippet?.title ?? '',
				})) ?? [];

			return videos;
		}),
});

// export type definition of API
export type AppRouter = typeof appRouter;
