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

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {BooleanDataValuePipe} from './boolean-data.pipe';
import {ColorValidPipe} from './valid/color-valid.pipe';
import {ColorValuePipe} from './color-value.pipe';
import {DataValuePipe} from './data-value.pipe';
import {DateTimeDataValuePipe} from './datetime-data-value.pipe';
import {DateTimeValidPipe} from './valid/datetime-valid.pipe';
import {NumberDataValuePipe} from './number-data-value.pipe';
import {PercentageDataValuePipe} from './percentage-data-value.pipe';
import {TextDataValuePipe} from './text-data-value.pipe';
import {UserDataValuePipe} from './user-data-value.pipe';
import {SelectDataValuePipe} from './select-data-value.pipe';
import {IsSelectDataValueValidPipe} from './valid/is-select-data-value-valid.pipe';
import {CoordinatesDataValuePipe} from './coordinates-data-value.pipe';
import {CoordinatesDataValueValidPipe} from './valid/coordinates-data-value-valid.pipe';
import {AddressDataValuePipe} from './address-data-value.pipe';
import {DurationDataValuePipe} from './duration-data-value.pipe';
import {NumberValidPipe} from './valid/number-valid.pipe';
import {PercentageValidPipe} from './valid/percentage-valid.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [
    TextDataValuePipe,
    DateTimeDataValuePipe,
    DateTimeValidPipe,
    DataValuePipe,
    BooleanDataValuePipe,
    NumberDataValuePipe,
    PercentageDataValuePipe,
    ColorValidPipe,
    ColorValuePipe,
    UserDataValuePipe,
    SelectDataValuePipe,
    IsSelectDataValueValidPipe,
    CoordinatesDataValuePipe,
    CoordinatesDataValueValidPipe,
    AddressDataValuePipe,
    DurationDataValuePipe,
    NumberValidPipe,
    PercentageValidPipe,
  ],
  exports: [
    TextDataValuePipe,
    DateTimeDataValuePipe,
    DateTimeValidPipe,
    DataValuePipe,
    BooleanDataValuePipe,
    NumberDataValuePipe,
    PercentageDataValuePipe,
    ColorValidPipe,
    ColorValuePipe,
    UserDataValuePipe,
    SelectDataValuePipe,
    IsSelectDataValueValidPipe,
    CoordinatesDataValuePipe,
    CoordinatesDataValueValidPipe,
    AddressDataValuePipe,
    DurationDataValuePipe,
    NumberValidPipe,
    PercentageValidPipe,
  ],
})
export class DataPipesModule {}
