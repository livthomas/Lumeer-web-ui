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
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';

import {Subject} from 'rxjs';
import {KeyCode} from '../../../../key-code';
import {getCaretCharacterOffsetWithin, HtmlModifier} from '../../../../utils/html-modifier';
import {AttributeQueryItem} from '../model/attribute.query-item';

@Component({
  selector: 'attribute-condition',
  templateUrl: './attribute-condition.component.html',
  styleUrls: ['./attribute-condition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributeConditionComponent implements OnInit {
  @Input()
  public queryItem: AttributeQueryItem;

  @Input()
  public readonly: boolean;

  @Input()
  public queryItemForm: FormGroup;

  @Output()
  public enter = new EventEmitter();

  @Output()
  public moveRight = new EventEmitter();

  @Output()
  public change = new EventEmitter();

  @ViewChild('conditionInput', {static: true})
  private conditionInput: ElementRef;

  public focused: boolean;
  public moveSuggestionSelection$ = new Subject<number>();
  public useSuggestionSelection$ = new Subject<string>();

  private lastCommittedValue: string;

  public ngOnInit() {
    if (!this.readonly && this.conditionControl && !this.conditionControl.valid) {
      this.setEditing();
    }
    this.lastCommittedValue = this.queryItem.condition;
  }

  public get conditionControl(): AbstractControl {
    return this.queryItemForm && this.queryItemForm.get('condition');
  }

  public onInput(value: string) {
    const result = value.replace(/[\d\s]+/g, '');
    this.setValue(result);
  }

  private setValue(value: string) {
    this.conditionInput.nativeElement.textContent = value;
    this.conditionControl.setValue(value);
    this.queryItem.condition = value;
  }

  public onFocus() {
    this.focused = true;
  }

  public blur() {
    this.conditionInput.nativeElement.blur();
  }

  public onBlur() {
    this.focused = false;

    const trimmedValue = this.queryItem.condition.trim();
    this.setValue(trimmedValue);

    if (trimmedValue !== this.lastCommittedValue && this.conditionControl.valid) {
      this.change.emit();
      this.lastCommittedValue = trimmedValue;
    }
  }

  public onKeyDown(event: KeyboardEvent) {
    switch (event.code) {
      case KeyCode.ArrowDown:
      case KeyCode.ArrowUp:
        this.onUpAndDownArrowKeysDown(event);
        break;
      case KeyCode.ArrowRight:
        this.onRightArrowKeyDown();
        break;
      case KeyCode.Enter:
      case KeyCode.NumpadEnter:
      case KeyCode.Space:
        event.preventDefault();
        event.stopImmediatePropagation();
        event.code !== KeyCode.Space && this.useSuggestion();
        this.checkCaretPositionAndGoRight();
        break;
      case KeyCode.Tab:
        event.preventDefault();
        event.stopImmediatePropagation();
        this.moveRight.emit();
        break;
      case KeyCode.Escape:
        this.onEscapeKeyDown();
        break;
    }
  }

  public onUpAndDownArrowKeysDown(event: KeyboardEvent) {
    event.preventDefault();
    const direction = event.code === KeyCode.ArrowUp ? -1 : 1;
    this.moveSuggestionSelection$.next(direction);
  }

  public useSuggestion() {
    const value = this.queryItem.condition.trim();
    this.useSuggestionSelection$.next(value);
  }

  public onUseSuggestion(condition: string) {
    this.setValue(condition);
    this.enter.emit();
  }

  public setEditing() {
    setTimeout(() => HtmlModifier.setCursorAtTextContentEnd(this.conditionInput.nativeElement));
  }

  public onKeyPress(event: KeyboardEvent) {
    if (!isNaN(Number(event.key))) {
      event.preventDefault();
    }
  }

  private onRightArrowKeyDown() {
    this.checkCaretPositionAndGoRight();
  }

  private checkCaretPositionAndGoRight() {
    const inputLength = this.queryItem.condition.length;
    const caretOffset = getCaretCharacterOffsetWithin(this.conditionInput.nativeElement);
    if (caretOffset >= inputLength) {
      this.moveRight.emit();
    }
  }

  private onEscapeKeyDown() {
    this.conditionInput.nativeElement.blur();
  }
}
