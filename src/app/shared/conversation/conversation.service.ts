import * as _ from 'lodash';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../http/http.service';
import { Conversation } from './conversation';
import { UserService } from '../user/user.service';
import { ItemService } from '../item/item.service';
import { XmppService } from '../xmpp/xmpp.service';
import { MessageService } from '../message/message.service';
import { Message } from '../message/message';
import { EventService } from '../event/event.service';
import { PersistencyService } from '../persistency/persistency.service';
import { MessagesData, StoredConversation } from '../message/messages.interface';
import { Response } from '@angular/http';
import { NotificationService } from '../notification/notification.service';
import Timer = NodeJS.Timer;
import { LeadService } from './lead.service';
import { ConversationResponse } from './conversation-response.interface';
import { Filter } from './filter.interface';
import { Filters } from './conversation-filters';
import { TrackingService } from '../tracking/tracking.service';
import { ConversationTotals } from './totals.interface';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class ConversationService extends LeadService {

  protected API_URL: string = 'api/v3/protool/conversations';
  protected ARCHIVE_URL: string = 'api/v2/conversations';
  private PHONE_MESSAGE: string = 'Mi número de teléfono es';
  private SURVEY_MESSAGE: string = 'Ya he respondido a tus preguntas';

  private messagesObservable: Observable<Conversation[]>;

  constructor(http: HttpService,
              userService: UserService,
              itemService: ItemService,
              event: EventService,
              private xmpp: XmppService,
              private persistencyService: PersistencyService,
              private messageService: MessageService,
              private trackingService: TrackingService,
              private notificationService: NotificationService,
              private zone: NgZone) {
    super(http, userService, itemService, event);
  }

  public getLeads(since?: number, archived?: boolean): Observable<Conversation[]> {
    return this.query(since, archived)
    .flatMap((conversations: Conversation[]) => {
      if (conversations && conversations.length > 0) {
        return Observable.forkJoin(
          conversations.map((conversation: Conversation) => this.loadUnreadMessagesNumber(conversation))
        )
        .flatMap((convWithUnreadNumber: Conversation[]) => {
          return this.loadMessagesIntoConversations(convWithUnreadNumber)
          .map((convWithMessages: Conversation[]) => {
            if (!archived) {
              this.leads = this.leads.concat(convWithMessages);
            } else {
              this.archivedLeads = this.archivedLeads.concat(convWithMessages);
            }
            this.firstLoad = false;
            return convWithMessages;
          });
        });
      } else {
        this.firstLoad = false;
        return Observable.of([]);
      }
    });
  }

  public getPage(page: number, archive?: boolean, filters?: Filter[], pageSize: number = this.PAGE_SIZE): Observable<Conversation[]> {
    const init: number = (page - 1) * pageSize;
    const end: number = init + pageSize;
    return (archive ? this.archivedStream$ : this.stream$).asObservable()
    .map((conversations: Conversation[]) => {
      if (filters) {
        return this.filter(conversations, filters);
      }
      return conversations;
    })
    .map((conversations: Conversation[]) => {
      return _.reverse(_.sortBy(conversations, 'modifiedDate'));
    })
    .map((conversations: Conversation[]) => {
      return conversations.slice(0, end);
    });
  }

  private filter(conversations: Conversation[], filters: Filter[]): Conversation[] {
    let bool: boolean;
    return conversations.filter((conversation: Conversation) => {
      bool = true;
      filters.forEach((filter) => {
        bool = bool && conversation[filter.key] === filter.value;
      });
      return bool;
    });
  }

  public getTotals(): Observable<ConversationTotals> {
    return this.stream$
    .flatMap((conversations: Conversation[]) => {
      return this.archivedStream$
      .map((archivedConversations: Conversation[]) => {
        const phonesShared: number = conversations.filter((conversation: Conversation) => {
          return conversation.phone !== undefined;
        }).length;
        const meetings: number = this.filter(conversations, Filters.MEETINGS).length;
        const messages: number = this.filter(conversations, Filters.OTHERS).length;
        const archivedPhonesShared: number = archivedConversations.filter((conversation: Conversation) => {
          return conversation.phone !== undefined;
        }).length;
        const archivedMeetings: number = this.filter(archivedConversations, Filters.MEETINGS).length;
        const archivedMessages: number = this.filter(archivedConversations, Filters.OTHERS).length;
        return {
          phonesShared: phonesShared,
          meetings: meetings,
          messages: messages,
          conversations: conversations.length,
          archivedPhonesShared: archivedPhonesShared,
          archivedMeetings: archivedMeetings,
          archivedMessages: archivedMessages
        };
      });
    });
  }

  public archiveWithPhones() {
    const archivedConversations: Conversation[] = _.remove(<Conversation[]>this.leads, (conversation: Conversation) => {
      return conversation.phone !== undefined;
    });
    archivedConversations.forEach((conversation: Conversation) => {
      this.sendRead(conversation);
    });
    this.bulkArchive(archivedConversations);
  }

  protected onArchive(conversation: Conversation) {
    this.sendRead(conversation);
  }

  protected onArchiveAll() {
    this.leads.forEach((conversation: Conversation) => {
      this.sendRead(conversation);
    });
    this.leads = this.bulkArchive(this.leads);
    this.stream();
  }

  private loadUnreadMessagesNumber(conversation: Conversation): Observable<Conversation> {
    return this.persistencyService.getUnreadMessages(conversation.id)
    .map((storedConv: StoredConversation) => {
      conversation.unreadMessages = storedConv.unreadMessages;
      this.messageService.totalUnreadMessages += storedConv.unreadMessages;
      return conversation;
    });
  }

  private loadMessagesIntoConversations(conversations: Conversation[]): Observable<Conversation[]> {
    return this.loadMessages(conversations)
    .flatMap((convWithMessages: Conversation[]) => {
      return (this.firstLoad ? this.loadNotStoredMessages(convWithMessages) : Observable.of(convWithMessages));
    })
    .map((convWithMessages: Conversation[]) => {
      return convWithMessages.filter((conversation: Conversation) => {
        return conversation.messages.length > 0;
      });
    });
  }

  public getConversationPage(id: string, archive?: boolean): number {
    let index: number = (archive ? this.archivedLeads : this.leads).findIndex((conversation: Conversation) => {
      return conversation.id === id;
    });
    if (index === -1) {
      return -1;
    }
    return Math.ceil((index + 1) / this.PAGE_SIZE);
  }

  public findMessage(messages: Message[], message: Message): Message {
    return messages.filter((msg: Message): boolean => {
      return (msg.id === message.id);
    })[0];
  }

  public addMessage(conversation: Conversation, message: Message): boolean {
    if (!this.findMessage(conversation.messages, message)) {
      conversation.messages.push(message);
      conversation.modifiedDate = new Date().getTime();
      if (message.fromBuyer) {
        this.handleUnreadMessage(conversation);
      }
      return true;
    }
  }

  public get(id: string): Observable<Conversation> {
    return this.http.get(`${this.API_URL}/${id}`)
    .flatMap((res: Response) => {
      let conversation: ConversationResponse = res.json();
      return Observable.forkJoin(
        this.itemService.get(conversation.item_id),
        this.userService.get(conversation.user_id)
      ).map((data: any[]) => {
        conversation.user = data[1];
        conversation = <ConversationResponse>this.setItem(conversation, data[0]);
        return conversation;
      });
    })
    .map((data: ConversationResponse) => this.mapRecordData(data));
  }

  public sendRead(conversation: Conversation) {
    if (conversation.unreadMessages > 0) {
      this.xmpp.sendConversationStatus(conversation.user.id, conversation.id);
      this.messageService.totalUnreadMessages -= conversation.unreadMessages;
      conversation.unreadMessages = 0;
      this.event.emit(EventService.CONVERSATION_READ, conversation);
      this.trackingService.track(TrackingService.CONVERSATION_READ, {conversation_id: conversation.id});
      this.persistencyService.saveUnreadMessages(conversation.id, 0);
    }
  }

  private handleUnreadMessage(conversation: Conversation) {
    this.zone.run(() => {
      conversation.unreadMessages++;
      this.persistencyService.saveUnreadMessages(conversation.id, conversation.unreadMessages);
      this.messageService.totalUnreadMessages++;
    });
  }

  private loadMessages(conversations: Conversation[]): Observable<Conversation[]> {
    if (this.messagesObservable) {
      return this.messagesObservable;
    }
    this.messagesObservable = this.recursiveLoadMessages(conversations)
    .share()
    .do(() => {
      this.messagesObservable = null;
    });
    return this.messagesObservable;
  }

  private recursiveLoadMessages(conversations: Conversation[], index: number = 0): Observable<Conversation[]> {
    return this.xmpp.isConnected()
    .flatMap(() => {
      if (conversations && conversations[index]) {
        return this.messageService.getMessages(conversations[index])
        .flatMap((res: MessagesData) => {
          conversations[index].messages = res.data;
          conversations[index].lastMessageRef = res.meta.first;
          conversations[index].oldMessagesLoaded = res.meta.end;
          if (index < conversations.length - 1) {
            return this.recursiveLoadMessages(conversations, index + 1);
          }
          return Observable.of(conversations);
        });
      } else {
        return Observable.of(null);
      }
    });
  }

  public loadNotStoredMessages(conversations: Conversation[]): Observable<Conversation[]> {
    return this.xmpp.isConnected()
    .flatMap(() => {
      return this.messageService.getNotSavedMessages().map((response: MessagesData) => {
        if (response.data.length) {
          let conversation: Conversation;
          response.data.forEach((message: Message) => {
            conversation = conversations.filter((conversation: Conversation): boolean => {
              return (conversation.id === message.conversationId);
            })[0];
            if (conversation) {
              if (!this.findMessage(conversation.messages, message)) {
                message = this.messageService.addUserInfo(conversation, message);
                conversation.messages.push(message);
                if (message.fromBuyer) {
                  this.handleUnreadMessage(conversation);
                }
              }
            } else {
              this.get(message.conversationId).subscribe((conversation: Conversation) => {
                message = this.messageService.addUserInfo(conversation, message);
                this.addMessage(conversation, message);
                conversations.unshift(conversation);
                if (message.fromBuyer) {
                  this.handleUnreadMessage(conversation);
                }
              });
            }
          });
        }
        return conversations;
      });
    });
  }

  protected mapRecordData(data: ConversationResponse): Conversation {
    return new Conversation(
      data.id,
      data.legacy_id,
      data.modified_date,
      data.expected_visit,
      data.user,
      data.item,
      [],
      data.buyer_phone_number,
      data.survey_responses
    );
  }

  public handleNewMessages(message: Message, updateDate: boolean) {
    if (!this.firstLoad) {
      this.onNewMessage(message, updateDate);
    } else {
      let interval: Timer = setInterval(() => {
        if (!this.firstLoad) {
          clearInterval(interval);
          this.onNewMessage(message, updateDate);
        }
      }, 500);
    }
  }

  private onNewMessage(message: Message, updateDate: boolean) {
    let conversation: Conversation = (<Conversation[]>this.leads).find((c: Conversation) => c.id === message.conversationId);
    let messageToUpdate: Message = conversation ? conversation.messages.find((m: Message) => m.id === message.id) : null;
    if (updateDate && messageToUpdate) {
      messageToUpdate.date = message.date;
      this.persistencyService.updateMessageDate(message);
    } else if (message.message) {
      this.persistencyService.saveMessages(message);
      if (conversation) {
        this.updateConversation(message, conversation).subscribe(() => {
          message = this.messageService.addUserInfo(conversation, message);
          if (this.addMessage(conversation, message)) {
            this.event.emit(EventService.MESSAGE_ADDED, message);
            this.leads = this.bumpConversation(conversation);
            this.notificationService.sendBrowserNotification(message);
            this.stream$.next(this.leads);
          }
        });
      } else {
        const archivedConversationIndex: number = _.findIndex(this.archivedLeads, {'id': message.conversationId});
        if (archivedConversationIndex > -1) {
          const unarchivedConversation: Conversation = (<Conversation[]>this.archivedLeads).splice(archivedConversationIndex, 1)[0];
          unarchivedConversation.archived = false;
          this.addConversation(unarchivedConversation, message);
          this.event.emit(EventService.CONVERSATION_UNARCHIVED);
        } else {
          this.requestConversationInfo(message);
        }
      }
    }
  }

  private updateConversation(message: Message, conversation: Conversation): Observable<Conversation> {
    if (message.message.indexOf(this.PHONE_MESSAGE) !== -1 || message.message.indexOf(this.SURVEY_MESSAGE) !== -1) {
      return this.http.get(`${this.API_URL}/${conversation.id}`)
      .map((res: Response) => {
        return res.json();
      })
      .map((conversationResponse: ConversationResponse) => {
        conversation.phone = conversationResponse.buyer_phone_number;
        conversation.surveyResponses = conversationResponse.survey_responses;
        return conversation;
      });
    } else {
      return Observable.of(conversation);
    }
  }

  private bumpConversation(conversation: Conversation) {
    let index: number = this.leads.indexOf(conversation);
    if (index > 0) {
      this.leads.splice(index, 1);
      this.leads.unshift(conversation);
    }
    return this.leads;
  }

  private requestConversationInfo(message: Message) {
    this.get(message.conversationId).subscribe((conversation: Conversation) => {
      this.addConversation(conversation, message);
    });
  }

  private addConversation(conversation: Conversation, message: Message) {
    message = this.messageService.addUserInfo(conversation, message);
    this.addMessage(conversation, message);
    this.leads.unshift(conversation);
    this.notificationService.sendBrowserNotification(message);
    this.stream$.next(this.leads);
  }

}
