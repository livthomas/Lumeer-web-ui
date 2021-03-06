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

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  LOCALE_ID,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {CalendarMode} from '../../../../../core/store/calendars/calendar';
import {CalendarEvent, CalendarEventTimesChangedEvent, CalendarMonthViewDay} from 'angular-calendar';
import {Subject} from 'rxjs';
import * as moment from 'moment';
import {DayViewHourSegment, MonthViewDay, WeekViewHourColumn} from 'calendar-utils';
import {CalendarMetaData} from '../../util/calendar-util';

const DEFAULT_NEW_EVENT_HOUR = 9;

@Component({
  selector: 'calendar-visualization',
  templateUrl: './calendar-visualization.component.html',
  styleUrls: ['./calendar-visualization.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarVisualizationComponent {
  @Input()
  public events: CalendarEvent<CalendarMetaData>[] = [];

  @Input()
  public currentMode: CalendarMode;

  @Input()
  public currentDate: Date;

  @Output()
  public timesChange = new EventEmitter<{documentId: string; changes: {attributeId: string; value: any}[]}>();

  @Output()
  public newEvent = new EventEmitter<number>();

  @Output()
  public eventClick = new EventEmitter<CalendarEvent<CalendarMetaData>>();

  public readonly calendarMode = CalendarMode;

  public refresh: Subject<any> = new Subject();

  constructor(@Inject(LOCALE_ID) public locale: string) {}

  public eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();

    this.onDocumentTimesChange(event);
  }

  private onDocumentTimesChange(event: CalendarEvent) {
    const {startAttributeId, endAttributeId} = event.meta;

    const changes = [];

    startAttributeId && changes.push({attributeId: startAttributeId, value: event.start});
    endAttributeId && changes.push({attributeId: endAttributeId, value: event.end});

    if (changes.length) {
      this.timesChange.emit({documentId: event.meta.documentId, changes});
    }
  }

  public monthDoubleClick(day: MonthViewDay) {
    const date = moment(day.date)
      .hours(DEFAULT_NEW_EVENT_HOUR)
      .toDate();
    this.newEvent.emit(date.getTime());
  }

  public weekDoubleClick(segment: WeekViewHourColumn) {
    this.newEvent.emit(segment.date.getTime());
  }

  public dayDoubleClick(segment: DayViewHourSegment) {
    this.newEvent.emit(segment.date.getTime());
  }

  public beforeMonthViewRender({body}: {body: CalendarMonthViewDay[]}): void {
    body.forEach(cell => {
      const numGroups = new Set(cell.events.map(event => event.meta.collectionId)).size;
      if (numGroups >= 2 && cell.events.length >= 8) {
        const groups: Record<string, {color: string; length: number}> = {};
        cell.events.forEach((event: CalendarEvent<{collectionId: string; color: string}>) => {
          if (!groups[event.meta.collectionId]) {
            groups[event.meta.collectionId] = {color: event.meta.color, length: 0};
          }
          groups[event.meta.collectionId].length++;
        });

        cell['eventGroups'] = Object.values(groups);
      }
    });
  }

  public trackByEventId(index: number, event: CalendarEvent) {
    return event.id ? event.id : event;
  }

  public onEventClicked(data: {event: CalendarEvent<CalendarMetaData>}) {
    const {event} = data;
    this.eventClick.emit(event);
  }
}
