/*
 * Lumeer: Modern Data Definition and Processing Platform
 *
 * Copyright (C) since 2017 Lumeer.io, s.r.o. and/or its affiliates.
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

import {Action} from '@ngrx/store';
import {Collection} from '../collections/collection';
import {MapConfig, MapPosition} from './map.model';

export enum MapsActionType {
  CREATE_MAP = '[Maps] Create Map',
  DESTROY_MAP = '[Maps] Destroy Map',

  SELECT_ATTRIBUTE = '[Maps] Select Attribute',
  UPDATE_ATTRIBUTES = '[Maps] Update Attributes',

  CHANGE_POSITION = '[Maps] Change Position',
  CHANGE_POSITION_SAVED = '[Maps] Change Position Saved',

  CLEAR = '[Maps] Clear',
}

export namespace MapsAction {
  export class CreateMap implements Action {
    public readonly type = MapsActionType.CREATE_MAP;

    constructor(public payload: {mapId: string; config?: MapConfig}) {}
  }

  export class DestroyMap implements Action {
    public readonly type = MapsActionType.DESTROY_MAP;

    constructor(public payload: {mapId: string}) {}
  }

  export class SelectAttribute implements Action {
    public readonly type = MapsActionType.SELECT_ATTRIBUTE;

    constructor(public payload: {mapId: string; collectionId: string; index: number; attributeId: string}) {}
  }

  export class UpdateAttributes implements Action {
    public readonly type = MapsActionType.UPDATE_ATTRIBUTES;

    constructor(public payload: {mapId: string; collections: Collection[]}) {}
  }

  export class ChangePosition implements Action {
    public readonly type = MapsActionType.CHANGE_POSITION;

    constructor(public payload: {mapId: string; position: MapPosition}) {}
  }

  export class ChangePositionSaved implements Action {
    public readonly type = MapsActionType.CHANGE_POSITION_SAVED;

    constructor(public payload: {mapId: string; positionSaved: boolean}) {}
  }

  export class Clear implements Action {
    public readonly type = MapsActionType.CLEAR;
  }

  export type All =
    | CreateMap
    | DestroyMap
    | SelectAttribute
    | UpdateAttributes
    | ChangePosition
    | ChangePositionSaved
    | Clear;
}
