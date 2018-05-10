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

import {createFeatureSelector, createSelector} from '@ngrx/store';
import {SmartDocCursor, SmartDocModel} from './smartdoc.model';
import {findSmartDocByCursor, findSmartDocPartByPath} from './smartdoc.utils';

export interface SmartDocState {

  smartDoc: SmartDocModel;
  cursor: SmartDocCursor;

}

export const initialSmartDocState: SmartDocState = {
  smartDoc: null,
  cursor: null
};

export const selectSmartDocState = createFeatureSelector<SmartDocState>('smartDoc');

export const selectSmartDoc = createSelector(selectSmartDocState, state => state.smartDoc);
export const selectSmartDocPartByPath = (partPath: number[]) => createSelector(selectSmartDoc, smartDoc => findSmartDocPartByPath(smartDoc, partPath));
export const selectSmartDocByCursor = (cursor: SmartDocCursor) => createSelector(selectSmartDoc, smartDoc => findSmartDocByCursor(smartDoc, cursor));

export const selectSmartDocCursor = createSelector(selectSmartDocState, state => state.cursor);
