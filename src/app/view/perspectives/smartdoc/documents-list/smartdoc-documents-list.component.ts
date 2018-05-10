import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {mergeMap} from 'rxjs/operators';
import {AppState} from '../../../../core/store/app.state';
import {DocumentModel} from '../../../../core/store/documents/document.model';
import {selectDocumentsByCustomQuery, selectDocumentsByLink} from '../../../../core/store/documents/documents.state';
import {QueryModel} from '../../../../core/store/navigation/query.model';
import {SmartDocCursor, SmartDocEmbeddedPart} from '../../../../core/store/smartdoc/smartdoc.model';
import {selectSmartDocPartByPath} from '../../../../core/store/smartdoc/smartdoc.state';

@Component({
  selector: 'smartdoc-documents-list',
  templateUrl: './smartdoc-documents-list.component.html',
  styleUrls: ['./smartdoc-documents-list.component.scss']
})
export class SmartdocDocumentsListComponent implements OnInit {

  @Input()
  public cursor: SmartDocCursor;

  @Input()
  public linkedDocument: DocumentModel;

  @Input()
  public primary: boolean;

  @Input()
  public query: QueryModel;

  private documents$: Observable<DocumentModel[]>;

  public constructor(private store: Store<AppState>) {
  }

  public ngOnInit() {
    if (this.linkedDocument) {
      this.documents$ = this.store.select(selectSmartDocPartByPath(this.cursor.partPath)).pipe(
        mergeMap(smartDocPart => {
          const {linkTypeId} = smartDocPart as SmartDocEmbeddedPart;
          return this.store.select(selectDocumentsByLink(linkTypeId, this.linkedDocument.id));
        })
      );
    } else {
      this.documents$ = this.store.select(selectDocumentsByCustomQuery(this.query));
    }
  }

  public createDocumentCursor(documentId: string): SmartDocCursor {
    return {...this.cursor, documentIdsPath: this.cursor.documentIdsPath.concat(documentId)};
  }

}
