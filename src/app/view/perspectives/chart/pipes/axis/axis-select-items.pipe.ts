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

import {Pipe, PipeTransform} from '@angular/core';
import {ChartAxisType, ChartConfig} from '../../../../../core/store/charts/chart';
import {SelectItemWithConstraintId} from '../../../../../shared/select/select-constraint-item/select-item-with-constraint.component';

@Pipe({
  name: 'axisRestrictedIds',
})
export class AxisRestrictedIdsPipe implements PipeTransform {
  public transform(axisType: ChartAxisType, config: ChartConfig, isDataSet?: boolean): SelectItemWithConstraintId[] {
    if (isDataSet) {
      return [
        ...Object.entries(config.names || {})
          .filter(entry => entry[0] !== axisType)
          .map(entry => entry[1]),
        ...Object.values(config.axes || {}),
      ].map(axis => ({attributeId: axis.attributeId, resourceIndex: axis.resourceIndex}));
    } else {
      return [
        ...Object.entries(config.axes || {})
          .filter(entry => entry[0] !== axisType)
          .map(entry => entry[1]),
        ...Object.values(config.names || {}),
      ].map(axis => ({attributeId: axis.attributeId, resourceIndex: axis.resourceIndex}));
    }
  }
}
