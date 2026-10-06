import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-load-more-button',
  imports: [],
  templateUrl: './load-more-button.html',
  styleUrl: './load-more-button.scss',
})
export class LoadMoreButton {
  loading = input<boolean>(false);
  disabled = input<boolean>(false);

  loadMore = output<void>();

  onClick(): void {
    if (this.loading() || this.disabled()) return;
    this.loadMore.emit();
  }
}
