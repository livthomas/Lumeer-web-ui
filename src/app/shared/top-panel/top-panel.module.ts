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
import {RouterModule} from '@angular/router';
import {PipesModule} from '../pipes/pipes.module';
import {ControlsToggleComponent} from './controls-toggle/controls-toggle.component';
import {LumeerLogoComponent} from './lumeer-logo/lumeer-logo.component';
import {ResourceMenuModule} from './workspace-panel/resource-menu/resource-menu.module';
import {SearchBoxModule} from './search-box/search-box.module';
import {TopPanelComponent} from './top-panel.component';
import {LanguageLinkPipe} from './user-panel/user-menu/language-link.pipe';
import {UserMenuComponent} from './user-panel/user-menu/user-menu.component';
import {UserPanelComponent} from './user-panel/user-panel.component';
import {WorkspacePanelComponent} from './workspace-panel/workspace-panel.component';
import {TopPanelWrapperComponent} from './wrapper/top-panel-wrapper.component';
import {VideoMenuComponent} from './user-panel/video-menu/video-menu.component';
import {NotificationsMenuModule} from './user-panel/notifications-menu/notifications-menu.module';
import {InviteUserComponent} from './user-panel/invite-user/invite-user.component';
import {InviteUserDialogComponent} from './user-panel/invite-user/invite-user-dialog/invite-user-dialog.component';
import {ModalModule} from '../modal/modal.module';
import {ModalModule as NgxModalModule} from 'ngx-bootstrap/modal';
import {NewUserComponent} from './user-panel/invite-user/invite-user-dialog/new-user/new-user.component';
import {FormsModule} from '@angular/forms';
import {InputModule} from '../input/input.module';

@NgModule({
  imports: [
    CommonModule,
    PipesModule,
    RouterModule,
    ResourceMenuModule,
    SearchBoxModule,
    NotificationsMenuModule,
    ModalModule,
    NgxModalModule.forRoot(),
    FormsModule,
    InputModule,
  ],
  declarations: [
    TopPanelComponent,
    TopPanelWrapperComponent,
    UserMenuComponent,
    LanguageLinkPipe,
    LumeerLogoComponent,
    WorkspacePanelComponent,
    UserPanelComponent,
    ControlsToggleComponent,
    VideoMenuComponent,
    InviteUserComponent,
    InviteUserDialogComponent,
    NewUserComponent,
  ],
  exports: [TopPanelWrapperComponent, LumeerLogoComponent],
  entryComponents: [InviteUserDialogComponent],
})
export class TopPanelModule {}
