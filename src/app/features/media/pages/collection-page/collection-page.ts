import { Component, inject, signal, effect, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { CollectionService } from '@core/services/collection.service';
import { Collection } from '@core/models/collection.model';
import { Loader } from '@shared/components/loader/loader';
import { MediaCard } from '../../components/media-card/media-card';
import { PageCurl } from '@shared/components/page-curl/page-curl';

@Component({
  selector: 'app-collection-page',
  imports: [Loader, MediaCard, PageCurl],
  templateUrl: './collection-page.html',
  styleUrl: './collection-page.scss',
})
export class CollectionPage {
  private collectionService = inject(CollectionService);
  private router = inject(Router);
  private location = inject(Location);

  id = input.required<string>();

  collection = signal<Collection | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const collectionId = this.id();
      if (collectionId) this.load(collectionId);
    });
  }

  private load(id: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.collectionService.getCollection(Number(id)).subscribe({
      next: (data) => {
        this.collection.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load collection');
        this.loading.set(false);
      },
    });
  }

  goBack(): void {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/movies']);
    }
  }
}
