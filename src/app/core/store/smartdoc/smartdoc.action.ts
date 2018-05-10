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

import {Action} from '@ngrx/store';
import {SmartDocCursor, SmartDocPart} from './smartdoc.model';

export enum SmartDocActionType {

  ADD_PART = '[Smart Document] Add Part',
  REPLACE_PART = '[Smart Document] Replace Part',
  MOVE_PART = '[Smart Document] Move Part',
  REMOVE_PART = '[Smart Document] Remove Part',

  SET_CURSOR = '[SmartDoc Document] Set Cursor'

}

export namespace SmartDocAction {

  export class AddPart implements Action {
    public readonly type = SmartDocActionType.ADD_PART;

    public constructor(public payload: { parentPath: number[], part: SmartDocPart }) {
    }
  }

  export class ReplacePart implements Action {
    public readonly type = SmartDocActionType.REPLACE_PART;

    public constructor(public payload: { partPath: number[], deleteCount: number, part?: SmartDocPart }) {
    }
  }

  export class MovePart implements Action {
    public readonly type = SmartDocActionType.MOVE_PART;

    public constructor(public payload: { parentPath: number[], oldIndex: number, newIndex: number }) {
    }
  }

  export class RemovePart implements Action {
    public readonly type = SmartDocActionType.REMOVE_PART;

    public constructor(public payload: { partPath: number[] }) {
    }
  }

  export class SetCursor implements Action {
    public readonly type = SmartDocActionType.SET_CURSOR;

    public constructor(public payload: { cursor: SmartDocCursor }) {
    }
  }

  export type All = AddPart | ReplacePart | MovePart | SetCursor;
}
