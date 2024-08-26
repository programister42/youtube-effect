import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import {
	Subject,
	debounceTime,
	distinctUntilChanged,
	map,
	switchMap,
} from 'rxjs';
import { injectTrpcClient } from '../providers/trpc-client';

@Component({
	selector: 'ye-search',
	templateUrl: './search.component.html',
	styleUrl: './search.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [AsyncPipe, JsonPipe, FormsModule, AutoCompleteModule],
})
export class SearchComponent {
	#trpcClient = injectTrpcClient();

	#query = new Subject<string>();

	selectedVideo: string | null = null;

	videos = this.#query.pipe(
		takeUntilDestroyed(),
		debounceTime(500),
		distinctUntilChanged(),
		switchMap((query) => this.#searchVideos(query)),
	);

	videoSuggestions = this.videos.pipe(
		map((videos) => videos.map((video) => video.title)),
	);

	#searchVideos(query: string) {
		return this.#trpcClient.searchVideos.query({
			q: query,
			count: 5,
		});
	}

	completeMethod(event: { query: string }) {
		this.#query.next(event.query);
	}
}
