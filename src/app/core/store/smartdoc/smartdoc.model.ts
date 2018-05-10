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

import {Perspective} from '../../../view/perspectives/perspective';

export enum SmartDocPartType {

  Embedded = 'embedded',
  Text = 'text'

}

export interface SmartDocModel {

  collectionId: string;
  documentIdsOrder?: string[];
  parts: SmartDocPart[];

}

export interface SmartDocPart {

  type: SmartDocPartType;

}

export class SmartDocTextPart {

  public readonly type = SmartDocPartType.Text;

  public constructor(public text: string) {
  }

}

export class SmartDocEmbeddedPart {

  public readonly type = SmartDocPartType.Embedded;

  public constructor(public linkTypeId: string,
                     public perspective: Perspective,
                     public smartDoc?: SmartDocModel) {
  }

}

export interface SmartDocCursor {

  documentIdsPath: string[];
  partPath: number[];

}

export interface SmartDocConfig {

  collectionId: string;
  documentIdsOrder?: string[];
  parts: SmartDocConfigPart[];

}

export interface SmartDocConfigPart {

  type: SmartDocPartType;

  textHtml?: string;
  textData?: any;

  linkTypeId?: string;
  perspective?: Perspective;
  smartDoc?: SmartDocConfig;

}
