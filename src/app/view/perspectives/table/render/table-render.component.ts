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

import {Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter} from '@angular/core';
import {TableLayout} from './table-layout';
import {TableUserAction} from './table-user-action';

@Component({
  selector: 'table-render',
  templateUrl: './table-render.component.html',
  styleUrls: ['./table-render.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableRenderComponent {
  @Input()
  public layout: TableLayout;

  @Output()
  public userAction = new EventEmitter<TableUserAction>();
}
