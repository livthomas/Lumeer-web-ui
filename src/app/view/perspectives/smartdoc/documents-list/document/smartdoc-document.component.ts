import {Component, Input} from '@angular/core';
import {DocumentModel} from '../../../../../core/store/documents/document.model';
import {SmartDocCursor, SmartDocPart, SmartDocPartType} from '../../../../../core/store/smartdoc/smartdoc.model';

@Component({
  selector: 'smartdoc-document',
  templateUrl: './smartdoc-document.component.html',
  styleUrls: ['./smartdoc-document.component.scss']
})
export class SmartdocDocumentComponent {

  @Input()
  public cursor: SmartDocCursor;

  @Input()
  public document: DocumentModel;

  public parts: SmartDocPart[];

  public isEmbeddedPart(part: SmartDocPart): boolean {
    return part.type === SmartDocPartType.Embedded;
  }

  public isTextPart(part: SmartDocPart): boolean {
    return part.type === SmartDocPartType.Text;
  }

  public createPartCursor(partIndex: number): SmartDocCursor {
    const partIndexesPath = this.cursor.partPath.concat(partIndex);
    return {...this.cursor, partPath: partIndexesPath};
  }

}
