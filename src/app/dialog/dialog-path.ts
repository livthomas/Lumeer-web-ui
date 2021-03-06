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

export enum DialogPath {
  COLLECTION_ATTRIBUTE_FUNCTION = 'collection-attribute-function',
  LINK_ATTRIBUTE_FUNCTION = 'link-attribute-function',
  COLLECTION_ATTRIBUTE_TYPE = 'collection-attribute-type',
  LINK_ATTRIBUTE_TYPE = 'link-attribute-type',
  CREATE_LINK = 'create-link',
  FEEDBACK = 'feedback',
  SHARE_VIEW = 'share-view',
  CREATE_ORGANIZATION = 'create-organization',
  CREATE_PROJECT = 'create-project',
  PLAY_VIDEO = 'video',
  CALENDAR_EVENT = 'calendar-event',
}

export const dialogPathsMap: {[id: string]: DialogPath} = {
  [DialogPath.COLLECTION_ATTRIBUTE_FUNCTION]: DialogPath.COLLECTION_ATTRIBUTE_FUNCTION,
  [DialogPath.LINK_ATTRIBUTE_FUNCTION]: DialogPath.LINK_ATTRIBUTE_FUNCTION,
  [DialogPath.COLLECTION_ATTRIBUTE_TYPE]: DialogPath.COLLECTION_ATTRIBUTE_TYPE,
  [DialogPath.LINK_ATTRIBUTE_TYPE]: DialogPath.LINK_ATTRIBUTE_TYPE,
  [DialogPath.CREATE_LINK]: DialogPath.CREATE_LINK,
  [DialogPath.FEEDBACK]: DialogPath.FEEDBACK,
  [DialogPath.SHARE_VIEW]: DialogPath.SHARE_VIEW,
  [DialogPath.CREATE_ORGANIZATION]: DialogPath.CREATE_ORGANIZATION,
  [DialogPath.CREATE_PROJECT]: DialogPath.CREATE_PROJECT,
  [DialogPath.PLAY_VIDEO]: DialogPath.PLAY_VIDEO,
  [DialogPath.CALENDAR_EVENT]: DialogPath.CALENDAR_EVENT,
};
