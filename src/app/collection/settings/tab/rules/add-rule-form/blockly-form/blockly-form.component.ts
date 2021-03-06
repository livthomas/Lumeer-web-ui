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

import {ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {BlocklyRuleConfiguration} from '../../../../../../core/model/rule';
import {Observable} from 'rxjs';
import {Collection} from '../../../../../../core/store/collections/collection';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../../../core/store/app.state';
import {selectAllCollections} from '../../../../../../core/store/collections/collections.state';
import {selectAllLinkTypes} from '../../../../../../core/store/link-types/link-types.state';
import {LinkType} from '../../../../../../core/store/link-types/link.type';
import {RuleVariable} from '../../rule-variable-type';
import {BLOCKLY_FUNCTION_TOOLBOX} from '../../../../../../shared/blockly/blockly-editor/blockly-editor-toolbox';
import {BlocklyDebugDisplay} from '../../../../../../shared/blockly/blockly-debugger/blockly-debugger.component';

@Component({
  selector: 'blockly-form',
  templateUrl: './blockly-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlocklyFormComponent implements OnInit {
  @Input()
  public config: BlocklyRuleConfiguration;

  @Input()
  public collection: Collection;

  @Input()
  public form: FormGroup;

  public displayDebug: BlocklyDebugDisplay = BlocklyDebugDisplay.DisplayNone;

  public collections$: Observable<Collection[]>;

  public linkTypes$: Observable<LinkType[]>;

  public variables: RuleVariable[];

  public functionToolbox = BLOCKLY_FUNCTION_TOOLBOX;

  public debugButtons: BlocklyDebugDisplay[] = [
    BlocklyDebugDisplay.DisplayJs,
    BlocklyDebugDisplay.DisplayError,
    BlocklyDebugDisplay.DisplayLog,
  ];

  public constructor(private store$: Store<AppState>) {}

  public get blocklyXml(): string {
    return this.form.get('blocklyXml').value;
  }

  public get blocklyJs(): string {
    return this.form.get('blocklyJs').value;
  }

  public get blocklyDryRunResult(): string {
    return this.form.get('blocklyDryRunResult').value;
  }

  public get blocklyError(): string {
    return this.form.get('blocklyError').value;
  }

  public get blocklyResultTimestamp(): string {
    return this.form.get('blocklyResultTimestamp').value;
  }

  public display(type: BlocklyDebugDisplay) {
    if (type !== BlocklyDebugDisplay.DisplayNone && this.displayDebug === type) {
      this.display(BlocklyDebugDisplay.DisplayNone);
    } else {
      this.displayDebug = type;
    }
  }

  public ngOnInit(): void {
    this.collections$ = this.store$.select(selectAllCollections);
    this.linkTypes$ = this.store$.select(selectAllLinkTypes);
    this.variables = [
      {name: 'oldDocument', collectionId: this.collection.id},
      {name: 'newDocument', collectionId: this.collection.id},
    ];
  }

  public onJsUpdate(jsCode: string) {
    this.form.get('blocklyJs').setValue(jsCode);
  }

  public onXmlUpdate(xmlCode: string) {
    this.form.get('blocklyXml').setValue(xmlCode);
  }
}
