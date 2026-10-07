import { Component, input, output, signal, HostListener, inject, effect } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Icon } from '@shared/components/icon/icon';

export interface MobileMenuSection {
  title: string;
  link?: string[];
  queryParams?: Record<string, string | number>;
  sections?: {
    title: string;
    hideTitle?: boolean;
    links: {
      label: string;
      link: string[];
      queryParams?: Record<string, string | number>;
    }[];
  }[];
}

@Component({
  selector: 'app-mobile-menu',
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './mobile-menu.html',
  styleUrl: './mobile-menu.scss',
})
export class MobileMenu {
  private router = inject(Router);

  open = input.required<boolean>();
  sections = input.required<MobileMenuSection[]>();

  close = output<void>();

  expanded = signal<string | null>(null);
  query = signal('');

  constructor() {
    effect(() => {
      const isOpen = this.open();
      if (typeof document === 'undefined') return;

      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  toggleExpand(title: string): void {
    this.expanded.update((current) => (current === title ? null : title));
  }

  onQueryInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
  }

  onSearchSubmit(): void {
    const q = this.query().trim();
    if (q.length < 2) return;

    this.query.set('');
    this.onClose();
    this.router.navigate(['/search'], { queryParams: { q } });
  }

  clearQuery(): void {
    this.query.set('');
  }

  onClose(): void {
    this.expanded.set(null);
    this.query.set('');
    this.close.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) {
      this.onClose();
    }
  }
}
