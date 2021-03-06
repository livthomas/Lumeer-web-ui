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
import {DefaultWorkspace, User} from './user';
import {InvitationType} from '../../model/invitation-type';

export enum UsersActionType {
  GET = '[Users] Get',
  GET_SUCCESS = '[Users] Get :: Success',
  GET_FAILURE = '[Users] Get :: Failure',

  GET_CURRENT_USER = '[Users] Get current user',
  GET_CURRENT_USER_WITH_LAST_LOGIN = '[Users] Get current user with last login',
  GET_CURRENT_USER_SUCCESS = '[Users] Get current user:: Success',

  PATCH_CURRENT_USER = '[Users] Patch Current',

  SAVE_DEFAULT_WORKSPACE = '[Users] Save default workspace',
  SAVE_DEFAULT_WORKSPACE_SUCCESS = '[Users] Save default workspace :: Success',
  SAVE_DEFAULT_WORKSPACE_FAILURE = '[Users] Save default workspace :: Failure',

  CREATE = '[Users] Create',
  CREATE_SUCCESS = '[Users] Create :: Success',
  CREATE_FAILURE = '[Users] Create :: Failure',

  INVITE = '[Users] Invite',
  INVITE_SUCCESS = '[Users] Invite :: Success',
  INVITE_FAILURE = '[Users] Invite :: Failure',

  UPDATE = '[Users] Update',
  UPDATE_SUCCESS = '[Users] Update :: Success',
  UPDATE_FAILURE = '[Users] Update :: Failure',

  DELETE = '[Users] Delete',
  DELETE_SUCCESS = '[Users] Delete :: Success',
  DELETE_FAILURE = '[Users] Delete :: Failure',

  SET_PENDING = '[Users] Set Pending',

  CLEAR = '[Users] Clear',
}

export namespace UsersAction {
  export class Get implements Action {
    public readonly type = UsersActionType.GET;

    public constructor(public payload: {organizationId: string}) {}
  }

  export class GetSuccess implements Action {
    public readonly type = UsersActionType.GET_SUCCESS;

    public constructor(public payload: {organizationId: string; users: User[]}) {}
  }

  export class GetCurrentUser implements Action {
    public readonly type = UsersActionType.GET_CURRENT_USER;
  }

  export class GetCurrentUserWithLastLogin implements Action {
    public readonly type = UsersActionType.GET_CURRENT_USER_WITH_LAST_LOGIN;
  }

  export class GetCurrentUserSuccess implements Action {
    public readonly type = UsersActionType.GET_CURRENT_USER_SUCCESS;

    public constructor(public payload: {user: User}) {}
  }

  export class PatchCurrentUser implements Action {
    public readonly type = UsersActionType.PATCH_CURRENT_USER;

    public constructor(public payload: {user: Partial<User>; onSuccess?: () => void; onFailure?: () => void}) {}
  }

  export class SaveDefaultWorkspace implements Action {
    public readonly type = UsersActionType.SAVE_DEFAULT_WORKSPACE;

    public constructor(public payload: {defaultWorkspace: DefaultWorkspace}) {}
  }

  export class SaveDefaultWorkspaceSuccess implements Action {
    public readonly type = UsersActionType.SAVE_DEFAULT_WORKSPACE_SUCCESS;

    public constructor(public payload: {user: User; defaultWorkspace: DefaultWorkspace}) {}
  }

  export class SaveDefaultWorkspaceFailure implements Action {
    public readonly type = UsersActionType.SAVE_DEFAULT_WORKSPACE_FAILURE;

    public constructor(public payload: {error: any}) {}
  }

  export class GetFailure implements Action {
    public readonly type = UsersActionType.GET_FAILURE;

    public constructor(public payload: {error: any}) {}
  }

  export class Create implements Action {
    public readonly type = UsersActionType.CREATE;

    public constructor(public payload: {organizationId: string; user: User}) {}
  }

  export class CreateSuccess implements Action {
    public readonly type = UsersActionType.CREATE_SUCCESS;

    public constructor(public payload: {user: User}) {}
  }

  export class CreateFailure implements Action {
    public readonly type = UsersActionType.CREATE_FAILURE;

    public constructor(public payload: {error: any; organizationId: string}) {}
  }

  export class InviteUsers implements Action {
    public readonly type = UsersActionType.INVITE;

    public constructor(
      public payload: {organizationId: string; projectId: string; users: User[]; invitationType?: InvitationType}
    ) {}
  }

  export class InviteSuccess implements Action {
    public readonly type = UsersActionType.INVITE_SUCCESS;

    public constructor(public payload: {users: User[]}) {}
  }

  export class InviteFailure implements Action {
    public readonly type = UsersActionType.INVITE_FAILURE;

    public constructor(public payload: {error: any; organizationId: string; projectId: string}) {}
  }

  export class Update implements Action {
    public readonly type = UsersActionType.UPDATE;

    public constructor(public payload: {organizationId: string; user: User}) {}
  }

  export class UpdateSuccess implements Action {
    public readonly type = UsersActionType.UPDATE_SUCCESS;

    public constructor(public payload: {user: User}) {}
  }

  export class UpdateFailure implements Action {
    public readonly type = UsersActionType.UPDATE_FAILURE;

    public constructor(public payload: {error: any}) {}
  }

  export class Delete implements Action {
    public readonly type = UsersActionType.DELETE;

    public constructor(public payload: {organizationId: string; userId: string}) {}
  }

  export class DeleteSuccess implements Action {
    public readonly type = UsersActionType.DELETE_SUCCESS;

    public constructor(public payload: {userId: string}) {}
  }

  export class DeleteFailure implements Action {
    public readonly type = UsersActionType.DELETE_FAILURE;

    public constructor(public payload: {error: any}) {}
  }

  export class SetPending implements Action {
    public readonly type = UsersActionType.SET_PENDING;

    public constructor(public payload: {pending: boolean}) {}
  }

  export class Clear implements Action {
    public readonly type = UsersActionType.CLEAR;
  }

  export type All =
    | Get
    | GetSuccess
    | GetFailure
    | GetCurrentUser
    | GetCurrentUserWithLastLogin
    | GetCurrentUserSuccess
    | PatchCurrentUser
    | Create
    | CreateSuccess
    | CreateFailure
    | InviteUsers
    | InviteSuccess
    | InviteFailure
    | Update
    | UpdateSuccess
    | UpdateFailure
    | SaveDefaultWorkspace
    | SaveDefaultWorkspaceSuccess
    | SaveDefaultWorkspaceFailure
    | Delete
    | DeleteSuccess
    | DeleteFailure
    | SetPending
    | Clear;
}
