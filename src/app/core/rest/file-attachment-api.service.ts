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

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {DataCursor} from '../../shared/data-input/data-cursor';
import {FileAttachmentDto} from '../dto/file-attachment.dto';
import {Workspace} from '../store/navigation/workspace';

const API_URL = `${environment.apiUrl}/rest`;

@Injectable({
  providedIn: 'root',
})
export class FileAttachmentApiService {
  constructor(private http: HttpClient) {}

  public createFile(path: FileApiPath, file: FileAttachmentDto): Observable<FileAttachmentDto> {
    return this.http.post<FileAttachmentDto>(this.filesUrl(path), file);
  }

  public removeFile(path: Partial<FileApiPath>, fileId: string): Observable<any> {
    return this.http.delete(`${this.filesUrl(path)}/${fileId}`);
  }

  public getFilesByCollection(path: FileApiPath): Observable<FileAttachmentDto[]> {
    return this.http.get<FileAttachmentDto[]>(`${this.filesUrl(path)}/collection/${path.collectionId}`);
  }

  public getFilesByDocument(path: FileApiPath): Observable<FileAttachmentDto[]> {
    return this.http.get<FileAttachmentDto[]>(
      `${this.filesUrl(path)}/collection/${path.collectionId}/${path.documentId}`
    );
  }

  public getFilesByDocumentAttribute(path: FileApiPath): Observable<FileAttachmentDto[]> {
    return this.http.get<FileAttachmentDto[]>(
      `${this.filesUrl(path)}/collection/${path.collectionId}/${path.documentId}/${path.attributeId}`
    );
  }

  public getFilesWithDetailsByDocumentAttribute(path: FileApiPath): Observable<FileAttachmentDto[]> {
    return this.http.get<FileAttachmentDto[]>(
      `${this.filesUrl(path)}/collection/${path.collectionId}/${path.documentId}/${path.attributeId}/details`
    );
  }

  public getFilesByLinkType(path: FileApiPath): Observable<FileAttachmentDto[]> {
    return this.http.get<FileAttachmentDto[]>(`${this.filesUrl(path)}/link/${path.linkTypeId}`);
  }

  public getFilesByLinkInstance(path: FileApiPath): Observable<FileAttachmentDto[]> {
    return this.http.get<FileAttachmentDto[]>(`${this.filesUrl(path)}/link/${path.linkTypeId}/${path.linkInstanceId}`);
  }

  public getFilesByLinkInstanceAttribute(path: FileApiPath): Observable<FileAttachmentDto[]> {
    return this.http.get<FileAttachmentDto[]>(
      `${this.filesUrl(path)}/link/${path.linkTypeId}/${path.linkInstanceId}/${path.attributeId}`
    );
  }

  public getFilesWithDetailsByLinkInstanceAttribute(path: FileApiPath): Observable<FileAttachmentDto[]> {
    return this.http.get<FileAttachmentDto[]>(
      `${this.filesUrl(path)}/link/${path.linkTypeId}/${path.linkInstanceId}/${path.attributeId}/details`
    );
  }

  private filesUrl(workspace: Partial<FileApiPath>): string {
    return `${API_URL}/organizations/${workspace.organizationId}/projects/${workspace.projectId}/files`;
  }
}

export type FileApiPath = Pick<Workspace, 'organizationId' | 'projectId'> & DataCursor;

export function createFileApiPath(
  workspace: Pick<Workspace, 'organizationId' | 'projectId'>,
  dataCursor: DataCursor
): FileApiPath {
  const {organizationId, projectId} = workspace;
  return {...dataCursor, organizationId, projectId};
}
