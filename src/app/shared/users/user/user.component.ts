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

import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

import {User} from '../../../core/store/users/user';
import {ResourceType} from '../../../core/model/resource-type';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {NotificationService} from '../../../core/notifications/notification.service';

@Component({
  selector: '[user]',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent {
  @Input()
  public resourceType: ResourceType;

  @Input()
  public editable: boolean;

  @Input()
  public changeRoles: boolean;

  @Input()
  public user: User;

  @Input()
  public userRoles: string[];

  @Input()
  public groupRoles: string[];

  @Output()
  public userUpdated = new EventEmitter<User>();

  @Output()
  public userDeleted = new EventEmitter<User>();

  @Output()
  public rolesUpdate = new EventEmitter<string[]>();

  constructor(private i18n: I18n, private notificationService: NotificationService) {}

  public onDelete() {
    const message = this.i18n({id: 'users.user.delete.message', value: 'Do you want to permanently remove this user?'});
    const title = this.i18n({id: 'users.user.delete.title', value: 'Remove user?'});
    const yesButtonText = this.i18n({id: 'button.yes', value: 'Yes'});
    const noButtonText = this.i18n({id: 'button.no', value: 'No'});

    this.notificationService.confirm(message, title, [
      {text: noButtonText},
      {text: yesButtonText, action: () => this.deleteUser(), bold: false},
    ]);
  }

  public deleteUser() {
    this.userDeleted.emit(this.user);
  }

  public toggleRole(role: string) {
    if (!this.changeRoles) {
      return;
    }

    let roles;
    if (this.userRoles.includes(role)) {
      roles = this.userRoles.filter(r => r !== role);
    } else {
      roles = [...this.userRoles, role];
    }

    this.rolesUpdate.emit(roles);
  }
}
