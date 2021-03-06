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

import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {DateTimeConstraintConfig} from '../../../../../core/model/data/constraint-config';
import {removeAllFormControls} from '../../../../../shared/utils/form.utils';
import {environment} from '../../../../../../environments/environment';
import {TemplateService} from '../../../../../core/service/template.service';

@Component({
  selector: 'datetime-constraint-config-form',
  templateUrl: './datetime-constraint-config-form.component.html',
  styleUrls: ['./datetime-constraint-config-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatetimeConstraintConfigFormComponent implements OnInit, OnChanges {
  @Input()
  public config: DateTimeConstraintConfig;

  @Input()
  public form: FormGroup;

  public helpUrl: string;

  public readonly now = new Date().toISOString();
  public readonly formats = [
    'DD.MM.YYYY',
    'DD.MM.YYYY H:mm',
    'YYYY-MM-DD',
    'YYYY-MM-DD H:mm',
    'DD/MM/YYYY',
    'DD/MM/YYYY h:mm a',
    'MM/DD/YYYY',
    'MM/DD/YYYY h:mm a',
    'H:mm',
    'h:mm a',
  ];

  constructor(private templateService: TemplateService) {}

  public ngOnInit(): void {
    this.helpUrl = this.templateService.getDateTimeConstraintHelpUrl();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.config) {
      this.resetForm();
      this.createForm();
    }
  }

  private resetForm() {
    this.form.clearValidators();
    removeAllFormControls(this.form);
  }

  private createForm() {
    const format = (this.config && this.config.format) || this.formats[0];
    this.form.addControl('format', new FormControl(format));

    const selectFormat = this.formats.includes(format) ? format : '';
    this.form.addControl('selectFormat', new FormControl(selectFormat));

    this.form.addControl('minValue', new FormControl(this.config && this.config.minValue));
    this.form.addControl('maxValue', new FormControl(this.config && this.config.maxValue));
    // this.form.setValidators(minMaxValidator('minDateTime', 'maxDateTime'));
  }

  public onFormatChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.formatControl.setValue(select.value);
  }

  public get formatControl(): AbstractControl {
    return this.form.get('format');
  }

  public get selectFormatControl(): AbstractControl {
    return this.form.get('selectFormat');
  }

  public get minValueControl(): AbstractControl {
    return this.form.get('minValue');
  }

  public get maxValueControl(): AbstractControl {
    return this.form.get('maxValue');
  }
}
