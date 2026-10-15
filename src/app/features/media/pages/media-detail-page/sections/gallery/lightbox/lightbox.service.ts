import { Injectable, inject, Injector } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Lightbox } from './lightbox';
import { LIGHTBOX_DATA, LightboxData } from './lightbox.tokens';

@Injectable({ providedIn: 'root' })
export class LightboxService {
  private overlay = inject(Overlay);
  private injector = inject(Injector);
  private overlayRef: OverlayRef | null = null;

  open(data: LightboxData): void {
    if (this.overlayRef) return;

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'lightbox-backdrop',
      panelClass: 'lightbox-panel',
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    const injector = Injector.create({
      parent: this.injector,
      providers: [{ provide: LIGHTBOX_DATA, useValue: data }],
    });

    const portal = new ComponentPortal(Lightbox, null, injector);
    this.overlayRef.attach(portal);

    this.overlayRef.backdropClick().subscribe(() => this.close());
  }

  close(): void {
    if (!this.overlayRef) return;
    this.overlayRef.dispose();
    this.overlayRef = null;
  }
}
