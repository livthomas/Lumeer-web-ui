/*
 * Lumeer: Modern Data Definition and Processing Platform
 *
 * Copyright (C) since 2017 Lumeer.io, s.r.o. and/or its affiliates.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {FlexibleConnectedPositionStrategy, Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {Portal, TemplatePortal} from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {convertDropdownToConnectedPositions, DropdownPosition} from './dropdown-position';

@Component({
  selector: 'dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent implements AfterViewInit, OnDestroy {
  @Input()
  public closeOnClickOutside: boolean;

  @Input()
  public fitParent: boolean;

  @Input()
  public origin: ElementRef | HTMLElement;

  @Input()
  public positions: DropdownPosition[] = [DropdownPosition.BottomStart];

  @ViewChild('dropdown', {static: false})
  public dropdown: TemplateRef<any>;

  private overlayRef: OverlayRef;
  private portal: Portal<any>;

  constructor(private overlay: Overlay, private viewContainer: ViewContainerRef) {}

  public ngAfterViewInit() {
    this.portal = new TemplatePortal(this.dropdown, this.viewContainer);
  }

  public ngOnDestroy() {
    this.close();
  }

  public open(offsetX?: number) {
    if (this.overlayRef) {
      return;
    }

    const overlayConfig = this.createOverlayConfig(offsetX);

    this.overlayRef = this.overlay.create(overlayConfig);
    this.overlayRef.attach(this.portal);

    if (this.closeOnClickOutside) {
      this.overlayRef.backdropClick().subscribe(() => this.close());
    }

    this.syncWidth();
  }

  private createPositionStrategy(): FlexibleConnectedPositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo(this.origin)
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withPositions(convertDropdownToConnectedPositions(this.positions));
  }

  private createOverlayConfig(offsetX?: number): OverlayConfig {
    let positionStrategy = this.createPositionStrategy();

    if (offsetX || offsetX === 0) {
      positionStrategy = positionStrategy.withDefaultOffsetX(offsetX);
    }

    return {
      backdropClass: this.closeOnClickOutside ? 'cdk-overlay-transparent-backdrop' : undefined,
      disposeOnNavigation: true,
      hasBackdrop: this.closeOnClickOutside,
      panelClass: ['position-absolute', 'w-max-content'],
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      positionStrategy,
    };
  }

  public close() {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  public isOpen(): boolean {
    return !!this.overlayRef;
  }

  @HostListener('window:resize')
  public onWindowResize() {
    this.syncWidth();
  }

  private syncWidth() {
    if (!this.overlayRef || !this.fitParent) {
      return;
    }

    const clientRect = this.getOriginBoundingClientRect();
    this.overlayRef.updateSize({width: clientRect.width});
  }

  private getOriginBoundingClientRect(): DOMRect | ClientRect {
    const element: HTMLElement = this.origin instanceof ElementRef ? this.origin.nativeElement : this.origin;
    return element.getBoundingClientRect();
  }
}
