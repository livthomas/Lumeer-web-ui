import {Component, HostListener, Input} from '@angular/core';
import {CollectionModel} from '../../../../../core/store/collections/collection.model';
import {SmartDocCursor} from '../../../../../core/store/smartdoc/smartdoc.model';

@Component({
  selector: 'smartdoc-collection-panel',
  templateUrl: './smartdoc-collection-panel.component.html',
  styleUrls: ['./smartdoc-collection-panel.component.scss']
})
export class SmartdocCollectionPanelComponent {

  @Input()
  public collection: CollectionModel;

  @Input()
  public cursor: SmartDocCursor;

  public hovered: boolean;

  @HostListener('mouseenter')
  public onMouseEnter() {
    this.hovered = true;
  }

  @HostListener('mouseleave')
  public onMouseLeave() {
    this.hovered = false;
  }

  public borderRight(): string {
    return `3px solid ${this.collection.color}`;
  }

}
