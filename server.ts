import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { APP_BASE_HREF } from "@angular/common";
import { CommonEngine } from "@angular/ssr";
import express from "express";
import { API_PATHS } from "./src/app/constants/api-paths";
import type { Video } from "./src/app/types/video.interface";
import bootstrap from "./src/main.server";

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
	const server = express();
	const serverDistFolder = dirname(fileURLToPath(import.meta.url));
	const browserDistFolder = resolve(serverDistFolder, "../browser");
	const indexHtml = join(serverDistFolder, "index.server.html");

	const commonEngine = new CommonEngine();

	server.set("view engine", "html");
	server.set("views", browserDistFolder);

	// Example Express Rest API endpoints
	// server.get('/api/**', (req, res) => { });

	server.get(API_PATHS.searchVideos, (req, res) => {
		let id = 0;
		const videos: Video[] = Array.from({ length: 5 }, () => ({
			id: id++,
			title: `Video ${id}`,
		}));
		res.json(videos);
	});

	// Serve static files from /browser
	server.get(
		"**",
		express.static(browserDistFolder, {
			maxAge: "1y",
			index: "index.html",
		}),
	);

	// All regular routes use the Angular engine
	server.get("**", (req, res, next) => {
		const { protocol, originalUrl, baseUrl, headers } = req;

		commonEngine
			.render({
				bootstrap,
				documentFilePath: indexHtml,
				url: `${protocol}://${headers.host}${originalUrl}`,
				publicPath: browserDistFolder,
				providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
			})
			.then((html) => res.send(html))
			.catch((err) => next(err));
	});

	return server;
}

function run(): void {
	// biome-ignore lint/complexity/useLiteralKeys: TS4111: Property 'PORT' comes from an index signature, so it must be accessed with ['PORT']. [plugin angular-compiler]
	const port = process.env["PORT"] || 4000;

	// Start up the Node server
	const server = app();
	server.listen(port, () => {
		console.log(`Node Express server listening on http://localhost:${port}`);
	});
}

run();
