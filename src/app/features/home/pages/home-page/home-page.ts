import { Component } from '@angular/core';
import { MediaRandomizer } from '../../components/media-randomizer/media-randomizer';
import { MovieTrailerBar } from '../../components/movie-trailer-bar/movie-trailer-bar';

@Component({
  selector: 'app-home-page',
  imports: [MediaRandomizer, MovieTrailerBar],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {}
