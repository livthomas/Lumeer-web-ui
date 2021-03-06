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
import {escapeStringForRegex} from '../utils/string.utils';

@Pipe({
  name: 'highlightText',
})
export class HighlightTextPipe implements PipeTransform {
  public transform(text: any, highlightedText: any, prefixOnly?: boolean): string {
    if (!text) {
      return '';
    }
    const textString = String(text);
    const pattern = escapeStringForRegex(String(highlightedText));
    const match = textString.toString().match(new RegExp(pattern, 'i'));
    if (!match || (prefixOnly && match.index > 0)) {
      return textString;
    }
    return textString.replace(match.toString(), `<span class="text-success">${match}</span>`);
  }
}
