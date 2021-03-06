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
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {DateTimeConstraintConfig} from '../../../core/model/data/constraint-config';
import {createDateTimeOptions, DateTimeOptions} from '../../date-time/date-time-options';
import {DateTimePickerComponent} from '../../date-time/picker/date-time-picker.component';
import {KeyCode} from '../../key-code';
import {isDateValid} from '../../utils/common.utils';
import {formatDateTimeDataValue, getDateTimeSaveValue, parseDateTimeDataValue} from '../../utils/data.utils';
import {resetUnusedDatePart} from '../../utils/date.utils';
import {HtmlModifier} from '../../utils/html-modifier';

@Component({
  selector: 'datetime-data-input',
  templateUrl: './datetime-data-input.component.html',
  styleUrls: ['./datetime-data-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatetimeDataInputComponent implements OnChanges, AfterViewInit {
  @Input()
  public constraintConfig: DateTimeConstraintConfig;

  @Input()
  public focus: boolean;

  @Input()
  public readonly: boolean;

  @Input()
  public skipValidation: boolean;

  @Input()
  public value: any;

  @Output()
  public valueChange = new EventEmitter<string>();

  @Output()
  public save = new EventEmitter<string>();

  @Output()
  public cancel = new EventEmitter();

  @ViewChild('dateTimeInput', {static: true})
  public dateTimeInput: ElementRef<HTMLInputElement>;

  @ViewChild(DateTimePickerComponent, {static: false})
  public dateTimePicker: DateTimePickerComponent;

  public options: DateTimeOptions;

  private preventSaving: boolean;

  constructor(public element: ElementRef) {}

  public ngOnChanges(changes: SimpleChanges) {
    if ((changes.readonly || changes.focus) && !this.readonly && this.focus) {
      this.preventSaving = !!changes.value;
      setTimeout(() => {
        if (changes.value) {
          this.dateTimeInput.nativeElement.value = formatDateTimeDataValue(this.value, this.constraintConfig, false);
        }

        HtmlModifier.setCursorAtTextContentEnd(this.dateTimeInput.nativeElement);
        this.dateTimeInput.nativeElement.focus();
        this.dateTimePicker && this.dateTimePicker.open();
      });
    }
    if (changes.focus && !this.focus) {
      if (this.dateTimePicker) {
        this.dateTimePicker.close();
      }
    }
    if (changes.value && String(this.value).length === 1) {
      // show value entered into hidden input without any changes
      const input = this.dateTimeInput;
      setTimeout(() => input && (input.nativeElement.value = this.value));
    }
    if (changes.constraintConfig && this.constraintConfig) {
      this.options = createDateTimeOptions(this.constraintConfig.format);
    }
  }

  @HostListener('keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent) {
    switch (event.code) {
      case KeyCode.Enter:
      case KeyCode.NumpadEnter:
      case KeyCode.Tab:
        if (this.dateTimeInput) {
          this.preventSaving = true;
          const value = this.transformValue(this.dateTimeInput.nativeElement.value);
          // needs to be executed after parent event handlers
          setTimeout(() => this.save.emit(value));
        }
        return;
      case KeyCode.Escape:
        this.preventSaving = true;
        this.dateTimeInput.nativeElement.value = formatDateTimeDataValue(this.value, this.constraintConfig, false);
        this.cancel.emit();
        return;
    }
  }

  public onInput(event: Event) {
    const element = event.target as HTMLInputElement;
    this.valueChange.emit(element.value);
  }

  public onValueChange(date: Date) {
    const value = date && date.toISOString();
    this.valueChange.emit(value);
  }

  public onSave(date: Date) {
    if (this.preventSaving) {
      this.preventSaving = false;
      return;
    }

    if (date && !isDateValid(date)) {
      this.cancel.emit();
      return;
    }

    const previousDate = parseDateTimeDataValue(this.value, this.constraintConfig.format);
    const previousValue = previousDate && previousDate.toISOString();
    const value = date && resetUnusedDatePart(date, this.constraintConfig.format).toISOString();

    if (value !== previousValue) {
      this.save.emit(value);
    } else {
      this.cancel.emit();
    }
  }

  public onCancel() {
    this.cancel.emit();
  }

  private transformValue(value: string): string {
    return getDateTimeSaveValue(value, this.constraintConfig);
  }

  public ngAfterViewInit(): void {
    document.body.style.setProperty('--first-day-of-week', environment.locale === 'cs' ? '8' : '2');
  }
}
