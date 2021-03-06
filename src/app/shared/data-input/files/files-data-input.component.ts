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

import {HttpEvent, HttpEventType} from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {FileApiService} from '../../../core/api/file-api.service';
import {NotificationService} from '../../../core/notifications/notification.service';
import {FileAttachment, FileAttachmentType} from '../../../core/store/file-attachments/file-attachment.model';
import {FileAttachmentsAction} from '../../../core/store/file-attachments/file-attachments.action';
import {selectFileAttachmentsByDataCursor} from '../../../core/store/file-attachments/file-attachments.state';
import {DataCursor, isDataCursorEntityInitialized} from '../data-cursor';

@Component({
  selector: 'files-data-input',
  templateUrl: './files-data-input.component.html',
  styleUrls: ['./files-data-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilesDataInputComponent implements OnInit, OnChanges {
  @Input()
  public cursor: DataCursor;

  @Input()
  public focus: boolean;

  @Input()
  public readonly: boolean;

  @Input()
  public value: any;

  @Output()
  public save = new EventEmitter<string>();

  @Output()
  public cancel = new EventEmitter();

  public fileAttachments$: Observable<FileAttachment[]>;

  public uploadProgress$ = new BehaviorSubject<number>(null);

  private cursor$ = new BehaviorSubject<DataCursor>(null);

  private preparedFile: File;

  constructor(
    public element: ElementRef,
    private fileApiService: FileApiService,
    private i18n: I18n,
    private notificationService: NotificationService,
    private store$: Store<{}>
  ) {}

  public ngOnInit() {
    this.fileAttachments$ = this.cursor$.pipe(
      switchMap(cursor => {
        if (cursor && !!(cursor.documentId || cursor.linkInstanceId)) {
          return this.store$.pipe(select(selectFileAttachmentsByDataCursor(cursor)));
        } else {
          return of([]);
        }
      })
    );
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.cursor && this.cursor) {
      this.cursor$.next(this.cursor);

      if (
        this.preparedFile &&
        isDataCursorEntityInitialized(this.cursor) &&
        !isDataCursorEntityInitialized(changes.cursor.previousValue)
      ) {
        this.createFile(this.preparedFile);
      }
    }
  }

  public onAdd(file: File) {
    if (isDataCursorEntityInitialized(this.cursor)) {
      this.createFile(file);
    } else {
      this.preparedFile = file;
      this.addFileNameToData(file.name);
    }
  }

  private createFile(file: File) {
    const fileAttachment: FileAttachment = {
      collectionId: this.cursor.collectionId,
      documentId: this.cursor.documentId,
      linkTypeId: this.cursor.linkTypeId,
      linkInstanceId: this.cursor.linkInstanceId,
      attributeId: this.cursor.attributeId,
      attachmentType: this.cursor.collectionId ? FileAttachmentType.Document : FileAttachmentType.Link,
      fileName: file.name,
    };

    this.store$.dispatch(
      new FileAttachmentsAction.Create({
        fileAttachment,
        onSuccess: fa => this.uploadFile(fa, file),
        onFailure: () => this.onCreateFailure(),
      })
    );
  }

  private uploadFile(fileAttachment: FileAttachment, file: File) {
    this.fileApiService.uploadFileWithProgress(fileAttachment.presignedUrl, file.type, file).subscribe(
      (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Response:
            this.uploadProgress$.next(null);
            this.onSuccess(fileAttachment);
            return;
          case HttpEventType.UploadProgress:
            this.uploadProgress$.next(Math.round((event.loaded / event.total) * 100));
            return;
        }
      },
      () => this.onUploadFailure(fileAttachment.id)
    );
  }

  private onSuccess(fileAttachment: FileAttachment) {
    this.showSuccessNotification();
    this.addFileNameToData(fileAttachment.fileName);
  }

  private showSuccessNotification() {
    this.notificationService.success(
      this.i18n({
        id: 'file.attachment.upload.success',
        value: 'The file is successfully saved.',
      })
    );
  }

  private onCreateFailure() {
    this.showErrorNotification();
  }

  private onUploadFailure(fileId: string) {
    this.uploadProgress$.next(null);
    this.removeFileAttachment(fileId);
    this.showErrorNotification();
  }

  private removeFileAttachment(fileId: string) {
    this.store$.dispatch(new FileAttachmentsAction.Remove({fileId}));
  }

  private showErrorNotification() {
    this.notificationService.error(
      this.i18n({
        id: 'file.attachment.upload.failure',
        value: 'Could not save the file. Please try again later.',
      })
    );
  }

  public onRemove(fileId: string, fileAttachments: FileAttachment[]) {
    const message = this.i18n({
      id: 'file.attachment.delete.confirm.message',
      value: 'Do you really want to permanently delete this file?',
    });
    const title = this.i18n({id: 'file.attachment.delete.confirm.title', value: 'Delete file?'});

    this.notificationService.confirmYesOrNo(message, title, () => {
      this.removeFileAttachment(fileId);
      this.removeFileNameFromData(fileId, fileAttachments);
    });
  }

  private addFileNameToData(fileName: string) {
    const value = !this.value || String(this.value).endsWith(fileName) ? fileName : `${this.value},${fileName}`;
    this.save.emit(value);
  }

  private removeFileNameFromData(fileId: string, fileAttachments: FileAttachment[]) {
    const value = fileAttachments
      .filter(file => file.id !== fileId)
      .map(file => file.fileName)
      .join(',');
    this.save.emit(value);
  }

  public onCancel() {
    this.cancel.emit();
  }
}
