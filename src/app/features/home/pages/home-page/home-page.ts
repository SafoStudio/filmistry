import { Component } from '@angular/core';
import { MediaRandomizer } from '../../components/media-randomizer/media-randomizer';

@Component({
  selector: 'app-home-page',
  imports: [MediaRandomizer],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {}
