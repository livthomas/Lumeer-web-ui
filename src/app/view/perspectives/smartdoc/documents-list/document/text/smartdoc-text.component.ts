import {Component, Input, OnInit} from '@angular/core';
import {DocumentModel} from '../../../../../../core/store/documents/document.model';
import {SmartDocCursor, SmartDocTextPart} from '../../../../../../core/store/smartdoc/smartdoc.model';

@Component({
  selector: 'smartdoc-text',
  templateUrl: './smartdoc-text.component.html',
  styleUrls: ['./smartdoc-text.component.scss']
})
export class SmartdocTextComponent implements OnInit {

  @Input()
  public cursor: SmartDocCursor;

  @Input()
  public document: DocumentModel;

  @Input()
  public part: SmartDocTextPart;

  constructor() {
  }

  ngOnInit() {
  }

}
