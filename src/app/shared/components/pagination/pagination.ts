import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  pageChange = output<number>();

  pages = computed<(number | '...')[]>(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const delta = 2;
    const range: (number | '...')[] = [];
    const left = Math.max(1, current - delta);
    const right = Math.min(total, current + delta);

    if (left > 1) {
      range.push(1);
      if (left > 2) range.push('...');
    }

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < total) {
      if (right < total - 1) range.push('...');
      range.push(total);
    }

    return range;
  });

  goTo(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) {
      return;
    }
    this.pageChange.emit(page);
  }

  prev(): void {
    this.goTo(this.currentPage() - 1);
  }

  next(): void {
    this.goTo(this.currentPage() + 1);
  }
}
