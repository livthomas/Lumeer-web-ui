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

import {SmartDocAction, SmartDocActionType} from './smartdoc.action';
import {SmartDocEmbeddedPart, SmartDocPart} from './smartdoc.model';
import {initialSmartDocState, SmartDocState} from './smartdoc.state';

export function smartDocReducer(state: SmartDocState = initialSmartDocState,
                                action: SmartDocAction.All): SmartDocState {
  switch (action.type) {
    case SmartDocActionType.CREATE_SUCCESS:
      return {...state, smartDoc: action.payload.smartDoc};
    case SmartDocActionType.REPLACE_PART:
      return replacePart(state, action);
    case SmartDocActionType.SET_CURSOR:
      return {...state, cursor: action.payload.cursor};
    case SmartDocActionType.CLEAR:
      return initialSmartDocState;
    default:
      return state;
  }
}

function replacePart(state: SmartDocState, action: SmartDocAction.ReplacePart): SmartDocState {
  const {partPath, deleteCount, part} = action.payload;

  const parts = replaceParts(state.smartDoc.parts, partPath, deleteCount, part);
  const smartDoc = {...state.smartDoc, parts};
  return {...state, smartDoc};
}

function replaceParts(parts: SmartDocPart[], partPath: number[], deleteCount: number, part?: SmartDocPart): SmartDocPart[] {
  const index = partPath[0];

  if (partPath.length === 1) {
    const updatedParts = parts.slice();
    updatedParts.splice(index, deleteCount, part || undefined);
    return updatedParts;
  }

  const {smartDoc} = parts[index] as SmartDocEmbeddedPart;
  return replaceParts(smartDoc.parts, partPath.slice(1), deleteCount, part);
}
