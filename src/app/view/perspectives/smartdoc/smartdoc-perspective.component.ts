import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs/Subscription';
import {AppState} from '../../../core/store/app.state';
import {selectQuery} from '../../../core/store/navigation/navigation.state';
import {QueryModel} from '../../../core/store/navigation/query.model';
import {SmartDocCursor} from '../../../core/store/smartdoc/smartdoc.model';

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

  public constructor(private store: Store<AppState>) {
  }

  public ngOnInit() {
    // TODO create smartdoc state based on config / query (linked collections)
    this.subscriptions.add(
      this.store.select(selectQuery).subscribe(query => this.query = query)
    );
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public isDisplayable(): boolean {
    return this.query && this.query.collectionIds && this.query.collectionIds.length === 1;
  }

}
