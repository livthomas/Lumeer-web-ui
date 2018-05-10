import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {DocumentModel} from '../../../../../../core/store/documents/document.model';
import {QueryModel} from '../../../../../../core/store/navigation/query.model';
import {SmartDocCursor, SmartDocEmbeddedPart} from '../../../../../../core/store/smartdoc/smartdoc.model';
import {Perspective} from '../../../../perspective';

@Component({
  selector: 'smartdoc-embedded',
  templateUrl: './smartdoc-embedded.component.html',
  styleUrls: ['./smartdoc-embedded.component.scss']
})
export class SmartdocEmbeddedComponent implements OnChanges {

  @Input()
  public cursor: SmartDocCursor;

  @Input()
  public document: DocumentModel;

  @Input()
  public part: SmartDocEmbeddedPart;

  public query: QueryModel;

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('part') && this.document) {
      this.query = {collectionIds: [this.document.collectionId]};
    }
  }

  public isSmartDocPerspective(): boolean {
    return this.part.perspective === Perspective.SmartDoc;
  }

  public isTablePerspective(): boolean {
    return this.part.perspective === Perspective.Table;
  }

}
