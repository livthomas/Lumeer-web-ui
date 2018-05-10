import {Component, Input} from '@angular/core';
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

}
