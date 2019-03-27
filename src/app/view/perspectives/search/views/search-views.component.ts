/*
 * Lumeer: Modern Data Definition and Processing Platform
 *
 * Copyright (C) since 2017 Answer Institute, s.r.o. and/or its affiliates.
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

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Router} from '@angular/router';

import {AppState} from '../../../../core/store/app.state';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {selectViewsLoaded} from '../../../../core/store/views/views.state';
import {selectNavigation} from '../../../../core/store/navigation/navigation.state';
import {Workspace} from '../../../../core/store/navigation/workspace';
import {View} from '../../../../core/store/views/view';
import {selectAllCollections} from '../../../../core/store/collections/collections.state';
import {selectAllLinkTypes} from '../../../../core/store/link-types/link-types.state';
import {QueryData} from '../../../../shared/top-panel/search-box/util/query-data';
import {filter, map} from 'rxjs/operators';
import {Perspective} from '../../perspective';
import {convertQueryModelToString} from '../../../../core/store/navigation/query.converter';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {ViewsAction} from '../../../../core/store/views/views.action';
import {NotificationService} from '../../../../core/notifications/notification.service';
import {Query} from '../../../../core/store/navigation/query';
import {isNullOrUndefined} from '../../../../shared/utils/common.utils';
import {selectViewsByQuery} from '../../../../core/store/common/permissions.selectors';

@Component({
  selector: 'search-views',
  templateUrl: './search-views.component.html',
})
export class SearchViewsComponent implements OnInit, OnDestroy {
  @Input()
  public maxLines: number = -1;

  public views$: Observable<View[]>;
  public queryData$: Observable<QueryData>;
  public query: Query;

  private subscriptions = new Subscription();
  private viewsLoaded: boolean;
  private workspace: Workspace;

  constructor(
    private router: Router,
    private i18n: I18n,
    private notificationService: NotificationService,
    private store$: Store<AppState>
  ) {}

  public ngOnInit() {
    this.views$ = this.store$.pipe(select(selectViewsByQuery));
    this.subscribeToNavigation();
    this.subscribeToData();
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private subscribeToNavigation() {
    const navigationSubscription = this.store$
      .pipe(
        select(selectNavigation),
        filter(navigation => !!navigation.workspace && !!navigation.query)
      )
      .subscribe(navigation => {
        this.workspace = navigation.workspace;
        this.query = navigation.query;
      });
    this.subscriptions.add(navigationSubscription);
  }

  private subscribeToData() {
    this.queryData$ = combineLatest(
      this.store$.pipe(select(selectAllCollections)),
      this.store$.pipe(select(selectAllLinkTypes))
    ).pipe(map(([collections, linkTypes]) => ({collections, linkTypes})));

    const loadedSubscription = this.store$
      .pipe(select(selectViewsLoaded))
      .subscribe(loaded => (this.viewsLoaded = loaded));
    this.subscriptions.add(loadedSubscription);
  }

  public onDeleteView(view: View) {
    const message = this.i18n({
      id: 'views.delete.message',
      value: 'Do you really want to permanently delete this view?',
    });
    const title = this.i18n({id: 'views.delete.title', value: 'Delete view?'});
    const yesButtonText = this.i18n({id: 'button.yes', value: 'Yes'});
    const noButtonText = this.i18n({id: 'button.no', value: 'No'});

    this.notificationService.confirm(message, title, [
      {text: noButtonText},
      {text: yesButtonText, action: () => this.deleteView(view), bold: false},
    ]);
  }

  public deleteView(view: View) {
    this.store$.dispatch(new ViewsAction.Delete({viewId: view.id}));
  }

  public isLoading(): boolean {
    return isNullOrUndefined(this.viewsLoaded) || isNullOrUndefined(this.query);
  }

  public showView(view: View) {
    this.router.navigate(['/w', this.workspace.organizationCode, this.workspace.projectCode, 'view', {vc: view.code}]);
  }

  public trackByView(index: number, view: View): string {
    return view.id;
  }

  public onShowAll() {
    this.router.navigate([this.workspacePath(), 'view', Perspective.Search, 'views'], {
      queryParams: {query: convertQueryModelToString(this.query)},
    });
  }

  private workspacePath(): string {
    return `/w/${this.workspace.organizationCode}/${this.workspace.projectCode}`;
  }
}
