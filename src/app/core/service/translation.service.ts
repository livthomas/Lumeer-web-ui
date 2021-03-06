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

import {Injectable} from '@angular/core';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {DurationUnit} from '../model/data/constraint-config';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  constructor(private i18n: I18n) {}

  public createDurationUnitsMap(): Record<DurationUnit, string> {
    return Object.values(DurationUnit).reduce((map, unit) => ({...map, [unit]: this.translateDurationUnit(unit)}), {});
  }

  public translateDurationUnit(unit: DurationUnit): string {
    return this.i18n(
      {
        id: 'constraint.duration.unit',
        value: '{unit, select, w {w} d {d} h {h} m {m} s {s}}',
      },
      {unit}
    );
  }
}
