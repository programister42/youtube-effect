import { AsyncPipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { AutoCompleteModule } from "primeng/autocomplete";
import { Subject, map, switchMap } from "rxjs";
import { API_PATHS } from "../constants/api-paths";
import type { Video } from "../types/video.interface";

@Component({
	selector: "ye-search",
	templateUrl: "./search.component.html",
	styleUrl: "./search.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [AsyncPipe, FormsModule, AutoCompleteModule],
})
export class SearchComponent {
	#httpClient = inject(HttpClient);

	#query = new Subject<string>();

	selectedVideo: string | null = null;

	videos = this.#query.pipe(
		takeUntilDestroyed(),
		switchMap((query) => this.#searchVideos(query)),
	);

	videoSuggestions = this.videos.pipe(
		map((videos) => videos.map((video) => video.title)),
	);

	#searchVideos(query: string) {
		return this.#httpClient.get<Video[]>(
			`${API_PATHS.searchVideos}?q=${query}`,
		);
	}

	completeMethod(event: { query: string }) {
		this.#query.next(event.query);
	}
}
