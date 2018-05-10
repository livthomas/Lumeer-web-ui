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

import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {Observable} from 'rxjs/Observable';
import {map, mergeMap, withLatestFrom} from 'rxjs/operators';
import {AppState} from '../app.state';
import {selectCollectionsDictionary} from '../collections/collections.state';
import {selectLinkTypesDictionary} from '../link-types/link-types.state';
import {selectQuery} from '../navigation/navigation.state';
import {NotificationsAction} from '../notifications/notifications.action';
import {selectViewSmartDocConfig} from '../views/views.state';
import {SmartDocAction, SmartDocActionType} from './smartdoc.action';
import {SmartDocEmbeddedPart} from './smartdoc.model';
import {selectSmartDoc, selectSmartDocPartByPath} from './smartdoc.state';
import {createSmartDocFromConfig, createSmartDocFromQuery, findSmartDocPartByPath, smartDocConfigFollowsQuery} from './smartdoc.utils';

@Injectable()
export class SmartDocEffects {

  @Effect()
  public create$: Observable<Action> = this.actions$.pipe(
    ofType<SmartDocAction.Create>(SmartDocActionType.CREATE),
    mergeMap(() => Observable.combineLatest(
      this.store$.select(selectQuery),
      this.store$.select(selectViewSmartDocConfig),
      this.store$.select(selectCollectionsDictionary),
      this.store$.select(selectLinkTypesDictionary)
    )),
    map(([query, config, collectionsMap, linkTypesMap]) => {
      const smartDoc = smartDocConfigFollowsQuery(config, query, linkTypesMap) ?
        createSmartDocFromConfig(config) : createSmartDocFromQuery(query, collectionsMap, linkTypesMap);
      return new SmartDocAction.CreateSuccess({smartDoc});
    })
  );

  @Effect()
  public addPart$: Observable<Action> = this.actions$.pipe(
    ofType<SmartDocAction.AddPart>(SmartDocActionType.ADD_PART),
    mergeMap(action => this.store$.select(selectSmartDocPartByPath(action.payload.parentPath)).pipe(
      map(parentPart => ({action, parentPart}))
    )),
    map(({action, parentPart}) => {
      const index = (parentPart as SmartDocEmbeddedPart).smartDoc.parts.length - 1;
      const partPath = action.payload.parentPath.concat(index);
      return new SmartDocAction.ReplacePart({partPath, deleteCount: 0, part: action.payload.part});
    })
  );

  @Effect()
  public removePart$: Observable<Action> = this.actions$.pipe(
    ofType<SmartDocAction.RemovePart>(SmartDocActionType.REMOVE_PART),
    map(action => {
      const title = this.i18n({id: 'smartdoc.remove.part.dialog.title', value: 'Remove part'});
      const message = this.i18n({id: 'smartdoc.remove.part.dialog.message', value: 'Do you really want to remove this template part?'});

      return new NotificationsAction.Confirm({
        title,
        message,
        action: new SmartDocAction.ReplacePart({partPath: action.payload.partPath, deleteCount: 1})
      });
    })
  );

  @Effect()
  public movePart$: Observable<Action> = this.actions$.pipe(
    ofType<SmartDocAction.MovePart>(SmartDocActionType.MOVE_PART),
    withLatestFrom(this.store$.select(selectSmartDoc)),
    mergeMap(([action, smartDoc]) => {
      const {parentPath, oldIndex, newIndex} = action.payload;
      const part = findSmartDocPartByPath(smartDoc, parentPath.concat(oldIndex));
      return [
        new SmartDocAction.ReplacePart({partPath: parentPath.concat(oldIndex), deleteCount: 1}),
        new SmartDocAction.ReplacePart({partPath: parentPath.concat(newIndex - (newIndex > oldIndex ? 1 : 0)), deleteCount: 0, part})
      ];
    })
  );

  constructor(private actions$: Actions,
              private i18n: I18n,
              private store$: Store<AppState>) {
  }

}
