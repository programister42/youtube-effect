import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchComponent } from './search/search.component';

@Component({
	selector: 'ye-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	standalone: true,
	imports: [RouterOutlet, SearchComponent],
})
export class AppComponent {}
