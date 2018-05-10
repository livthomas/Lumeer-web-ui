import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {mergeMap} from 'rxjs/operators';
import {Subscription} from 'rxjs/Subscription';
import {AppState} from '../../../../core/store/app.state';
import {CollectionModel} from '../../../../core/store/collections/collection.model';
import {selectCollectionById} from '../../../../core/store/collections/collections.state';
import {DocumentModel} from '../../../../core/store/documents/document.model';
import {selectDocumentsByCustomQuery, selectDocumentsByLink} from '../../../../core/store/documents/documents.state';
import {QueryModel} from '../../../../core/store/navigation/query.model';
import {SmartDocCursor, SmartDocEmbeddedPart} from '../../../../core/store/smartdoc/smartdoc.model';
import {selectSmartDocByCursor, selectSmartDocPartByPath} from '../../../../core/store/smartdoc/smartdoc.state';

@Component({
  selector: 'smartdoc-documents-list',
  templateUrl: './smartdoc-documents-list.component.html',
  styleUrls: ['./smartdoc-documents-list.component.scss']
})
export class SmartdocDocumentsListComponent implements OnInit, OnDestroy {

  @Input()
  public cursor: SmartDocCursor;

  @Input()
  public linkedDocument: DocumentModel;

  @Input()
  public primary: boolean;

  @Input()
  public query: QueryModel;

  public collection: CollectionModel;
  public documents: DocumentModel[];

  private subscriptions = new Subscription();

  public constructor(private store: Store<AppState>) {
  }

  public ngOnInit() {
    this.subscriptions.add(this.subscribeToCollection());
    this.subscriptions.add(this.subscribeToDocuments());
  }

  private subscribeToCollection(): Subscription {
    return this.store.select(selectSmartDocByCursor(this.cursor)).pipe(
      mergeMap(smartDoc => this.store.select(selectCollectionById(smartDoc.collectionId)))
    ).subscribe(collection => this.collection = collection);
  }

  private subscribeToDocuments(): Subscription {
    return this.selectDocuments().subscribe(documents => this.documents = documents);
  }

  private selectDocuments(): Observable<DocumentModel[]> {
    if (!this.linkedDocument) {
      return this.store.select(selectDocumentsByCustomQuery(this.query));
    }

    return this.store.select(selectSmartDocPartByPath(this.cursor.partPath)).pipe(
      mergeMap(smartDocPart => {
        const {linkTypeId} = smartDocPart as SmartDocEmbeddedPart;
        return this.store.select(selectDocumentsByLink(linkTypeId, this.linkedDocument.id));
      })
    );
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public createDocumentCursor(documentId: string): SmartDocCursor {
    return {...this.cursor, documentIdsPath: this.cursor.documentIdsPath.concat(documentId)};
  }

}
