import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SmartdocCollectionPanelComponent} from './documents-list/collection-panel/smartdoc-collection-panel.component';
import {SmartdocEmbeddedComponent} from './documents-list/document/embedded/smartdoc-embedded.component';
import {SmartdocDocumentComponent} from './documents-list/document/smartdoc-document.component';
import {SmartdocCkeditorComponent} from './documents-list/document/text/ckeditor/smartdoc-ckeditor.component';
import {SmartdocTextComponent} from './documents-list/document/text/smartdoc-text.component';
import {SmartdocDocumentsListComponent} from './documents-list/smartdoc-documents-list.component';
import {SmartdocPerspectiveComponent} from './smartdoc-perspective.component';
import {SmartdocAddButtonComponent} from './toolbar/add-button/smartdoc-add-button.component';
import {SmartdocEditorToolbarComponent} from './toolbar/editor-toolbar/smartdoc-editor-toolbar.component';
import {SmartdocToolbarComponent} from './toolbar/smartdoc-toolbar.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SmartdocPerspectiveComponent,
    SmartdocToolbarComponent,
    SmartdocDocumentsListComponent,
    SmartdocCollectionPanelComponent,
    SmartdocDocumentComponent,
    SmartdocEmbeddedComponent,
    SmartdocTextComponent,
    SmartdocCkeditorComponent,
    SmartdocAddButtonComponent,
    SmartdocEditorToolbarComponent
  ],
  entryComponents: [
    SmartdocPerspectiveComponent
  ]
})
export class SmartdocPerspectiveModule {
}
