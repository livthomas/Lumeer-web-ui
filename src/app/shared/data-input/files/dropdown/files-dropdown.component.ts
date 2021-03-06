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
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {BehaviorSubject} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {FileAttachment} from '../../../../core/store/file-attachments/file-attachment.model';
import {DropdownComponent} from '../../../dropdown/dropdown.component';

@Component({
  selector: 'files-dropdown',
  templateUrl: './files-dropdown.component.html',
  styleUrls: ['./files-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilesDropdownComponent implements AfterViewInit {
  @Input()
  public files: FileAttachment[];

  @Input()
  public origin: ElementRef | HTMLElement;

  @Input()
  public uploadProgress: number;

  @Output()
  public add = new EventEmitter<File>();

  @Output()
  public remove = new EventEmitter<string>();

  @Output()
  public cancel = new EventEmitter();

  @ViewChild(DropdownComponent, {static: false})
  public dropdown: DropdownComponent;

  public fileSizeError$ = new BehaviorSubject(null);

  constructor(private i18n: I18n) {}

  public ngAfterViewInit() {
    this.dropdown.open();
  }

  public onClick(event: MouseEvent) {
    // otherwise it is immediately closed in table
    event.stopPropagation();
  }

  public onFileChange(event: Event) {
    if (this.uploadProgress) {
      return;
    }

    const files: FileList = event.target['files'];

    if (files.length !== 1) {
      return;
    }

    const file = files.item(0);

    if (file.size > environment.maxFileUploadSize * 1024 * 1024) {
      this.showFileSizeError();
      return;
    }

    this.fileSizeError$.next(null);
    this.add.emit(file);
  }

  private showFileSizeError() {
    const size = environment.maxFileUploadSize.toFixed(0);
    this.fileSizeError$.next(
      this.i18n(
        {
          id: 'file.upload.max.size.error',
          value: 'Cannot process files bigger than {{size}} MB. Please upload smaller file.',
        },
        {size}
      )
    );
  }

  public onRemove(fileId: string) {
    this.remove.emit(fileId);
  }

  public onCancel() {
    this.cancel.emit();
  }

  public close() {
    if (this.dropdown) {
      this.dropdown.close();
    }
  }
}
