import { Component, input, output } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-page-curl',
  imports: [Icon],
  templateUrl: './page-curl.html',
  styleUrl: './page-curl.scss',
})
export class PageCurl {
  closing = input<boolean>(false);
  close = output<void>();
}
