import { NgModule } from '@angular/core';
import { MessageService } from '../message/message.service';
import { ConversationService } from './conversation.service';
import { UserModule } from '../user/user.module';
import { CallService } from './call.service';
import { CommonModule } from '@angular/common';
import { ItemModule } from '../item/item.module';
import { MomentModule } from 'angular2-moment';
import { MdIconModule } from '@angular/material';
import { NgbTooltipModule, NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

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
  providers: [
    ConversationService,
    CallService,
    MessageService
  ]
})
export class ConversationModule {
}
