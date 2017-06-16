import { NgModule } from '@angular/core';
import { MessageComponent } from './message/message.component';
import { MessageService } from '../message/message.service';
import { ConversationService } from './conversation.service';
import { UserModule } from '../user/user.module';
import { CallService } from './call.service';
import { CommonModule } from '@angular/common';
import { ConversationComponent } from './conversation/conversation.component';
import { ItemModule } from '../item/item.module';
import { MomentModule } from 'angular2-moment';
import { MdIconModule } from '@angular/material';
import { ArchiveButtonComponent } from './archive-button/archive-button.component';
import { CallStatusLabelPipe } from './call-status-label.pipe';
import { NgbTooltipModule, NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ArchivableComponent } from './archivable/archivable.component';
import { UnarchiveButtonComponent } from './unarchive-button/unarchive-button.component';
import { ProcessAllButtonComponent } from './process-all-button/process-all-button.component';

@NgModule({
  imports: [
    CommonModule,
    ItemModule,
    MomentModule,
    MdIconModule,
    UserModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbModalModule
  ],
  exports: [
    MessageComponent,
    ConversationComponent,
    ArchiveButtonComponent,
    CallStatusLabelPipe,
    ArchivableComponent,
    UnarchiveButtonComponent,
    ProcessAllButtonComponent
  ],
  declarations: [
    MessageComponent,
    ConversationComponent,
    ArchiveButtonComponent,
    CallStatusLabelPipe,
    ArchivableComponent,
    UnarchiveButtonComponent,
    ProcessAllButtonComponent
  ],
  providers: [
    ConversationService,
    CallService,
    MessageService
  ]
})
export class ConversationModule {
}
