import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import {AppState} from '../../../../../core/store/app.state';
import {DocumentModel} from '../../../../../core/store/documents/document.model';
import {SmartDocCursor, SmartDocPart, SmartDocPartType} from '../../../../../core/store/smartdoc/smartdoc.model';
import {selectSmartDocByCursor} from '../../../../../core/store/smartdoc/smartdoc.state';

@Component({
  selector: 'smartdoc-document',
  templateUrl: './smartdoc-document.component.html',
  styleUrls: ['./smartdoc-document.component.scss']
})
export class SmartdocDocumentComponent implements OnInit {

  @Input()
  public cursor: SmartDocCursor;

  @Input()
  public document: DocumentModel;

  public parts$: Observable<SmartDocPart[]>;

  public constructor(private store: Store<AppState>) {
  }

  public ngOnInit() {
    this.parts$ = this.store.select(selectSmartDocByCursor(this.cursor)).pipe(
      map(smartDoc => smartDoc.parts)
    );
  }

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
