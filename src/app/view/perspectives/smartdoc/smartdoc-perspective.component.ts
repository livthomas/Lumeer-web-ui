import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {tap} from 'rxjs/operators';
import {Subscription} from 'rxjs/Subscription';
import {AppState} from '../../../core/store/app.state';
import {DocumentsAction} from '../../../core/store/documents/documents.action';
import {selectQuery} from '../../../core/store/navigation/navigation.state';
import {QueryModel} from '../../../core/store/navigation/query.model';
import {SmartDocAction} from '../../../core/store/smartdoc/smartdoc.action';
import {SmartDocCursor, SmartDocModel} from '../../../core/store/smartdoc/smartdoc.model';
import {selectSmartDoc} from '../../../core/store/smartdoc/smartdoc.state';

@Component({
  selector: 'smartdoc-perspective',
  templateUrl: './smartdoc-perspective.component.html',
  styleUrls: ['./smartdoc-perspective.component.scss']
})
export class SmartdocPerspectiveComponent implements OnInit, OnDestroy {

  private query: QueryModel;
  private subscriptions = new Subscription();

  public cursor: SmartDocCursor = {
    documentIdsPath: [],
    partPath: []
  };

  public smartDoc: SmartDocModel;

  public constructor(private store: Store<AppState>) {
  }

  public ngOnInit() {
    this.subscriptions.add(this.subscribeToSmartDoc());
    this.subscriptions.add(this.subscribeToQuery());
  }

  private subscribeToSmartDoc(): Subscription {
    return this.store.select(selectSmartDoc).subscribe(smartDoc => {
      if (smartDoc) {
        this.smartDoc = smartDoc;
      } else {
        this.store.dispatch(new SmartDocAction.Create());
      }
    });
  }

  private subscribeToQuery(): Subscription {
    return this.store.select(selectQuery).pipe(
      tap(query => {
        if (query && !this.query) {
          // TODO load linked documents as well as other entitites
          this.store.dispatch(new DocumentsAction.Get({query}));
        }
      })
    ).subscribe(query => this.query = query);
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();

    // TODO save to view config in the same action
    this.store.dispatch(new SmartDocAction.Clear());
  }

  public isDisplayable(): boolean {
    return this.query && this.query.collectionIds && this.query.collectionIds.length === 1;
  }

  public isLoaded(): boolean {
    return !!this.smartDoc;
  }

}
