import { Injectable } from '@angular/core';
import { XmppService } from '../xmpp/xmpp.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Conversation } from '../conversation/conversation';
import { Message } from './message';
import { PersistencyService } from '../persistency/persistency.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user';
import { MessagesData, MessagesDataRecursive, StoredMessageRow, StoredMetaInfoData } from './messages.interface';

@Injectable()
export class MessageService {

  public totalUnreadMessages$: Subject<number> = new Subject<number>();
  private _totalUnreadMessages: number = 0;
  public newMessageEvent: Subscription;

  constructor(private xmpp: XmppService,
              private persistencyService: PersistencyService,
              private userService: UserService) {
  }

  set totalUnreadMessages(value: number) {
    value = value < 0 ? 0 : value;
    this._totalUnreadMessages = value;
    this.totalUnreadMessages$.next(value);
  }

  get totalUnreadMessages(): number {
    return this._totalUnreadMessages;
  }

  public getMessages(conversation: Conversation, total: number = -1): Observable<MessagesData> {
    return this.persistencyService.getMessages(conversation.id)
    .flatMap((data: StoredMessageRow[]) => {
      if (data.length) {
        return Observable.of({
          meta: {
            first: data[0].doc._id,
            end: true,
            last: data[data.length - 1].doc._id
          },
          data: data.map((message: any): Message => {
            return new Message(message.doc._id,
              message.doc.conversationId,
              message.doc.message,
              message.doc.from,
              message.doc.date,
              message.doc.read);
          })
        });
      } else {
        return this.query(conversation.id, conversation.lastMessageRef, total);
      }
    })
    .map((res: any) => {
      return {
        meta: res.meta,
        data: this.addUserInfoToArray(conversation, res.data)
      };
    });
  }

  public getNotSavedMessages(): Observable<MessagesData> {
    return this.persistencyService.getMetaInformation().flatMap((resp: StoredMetaInfoData) => {
      return this.query(null, resp.data.last, -1, resp.data.start).do((newMessages: MessagesData) => {
        if (newMessages.data.length) {
          this.persistencyService.saveMetaInformation(
            {last: newMessages.meta.last, start: newMessages.data[newMessages.data.length - 1].date.toISOString()}
          );
        }
      });
    });
  }

  public addUserInfoToArray(conversation: Conversation, messages: Message[]): Message[] {
    return messages.map((message) => this.addUserInfo(conversation, message));
  }

  public addUserInfo(conversation: Conversation, message: Message): Message {
    let seller: User = this.userService.user;
    let buyer: User = conversation.user;
    let userId: string = message.from.split('@')[0];
    message.user = (userId === seller.id) ? seller : buyer;
    message.fromBuyer = userId === buyer.id;
    return message;
  }

  public send(conversation: Conversation, message: string) {
    this.xmpp.sendMessage(conversation.user.id, conversation.id, message);
  }

  public query(conversationId: string, lastMessageRef: string, total: number = -1,
               start?: string): Observable<MessagesData> {
    return this.recursiveQuery(conversationId, lastMessageRef, total, [], start).first()
    .map((res: MessagesDataRecursive) => {
      res.data = res.messages;
      this.persistencyService.saveMessages(res.data);
      delete res.messages;
      return res;
    });
  }

  public resetCache() {
    this.totalUnreadMessages = 0;
  }

  private recursiveQuery(conversationId: string, lastMessageRef: string, total: number, messages: Message[],
                         start?: string): Observable<MessagesDataRecursive> {
    return this.xmpp.searchHistory(conversationId, lastMessageRef, start)
    .flatMap((res: MessagesDataRecursive) => {
      messages = start ? messages.concat(res.data) : res.data.concat(messages);
      let limit: boolean = total > -1 ? messages.length < total : true;
      if (!res.meta.end && limit) {
        lastMessageRef = start ? res.meta.last : res.meta.first;
        return this.recursiveQuery(conversationId, lastMessageRef, total, messages, start);
      }
      res.messages = messages;
      return Observable.of(res);
    });
  }

}
