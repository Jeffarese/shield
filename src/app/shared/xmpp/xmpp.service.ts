import * as _ from 'lodash';
import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Message } from '../message/message';
import { EventService } from '../event/event.service';
import { Observable} from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { PersistencyService } from '../persistency/persistency.service';
import Timer = NodeJS.Timer;
import { MessagesData, MetaInfo } from '../message/messages.interface';
import { XMPPClient, XmppBodyMessage } from './xmpp.interface';
import { TrackingService } from '../tracking/tracking.service';

@Injectable()
export class XmppService {

  private client: XMPPClient;
  private _connected: boolean = false;
  private confirmedMessages: string[] = [];
  private firstMessageDate: string;
  private currentJid: string;
  private resource: string;
  private reconnectInterval: Timer;
  private _reconnecting: boolean = false;
  private connected$: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private eventService: EventService,
              private persistencyService: PersistencyService,
              private trackingService: TrackingService) {
  }

  public connect(userId: string, accessToken: string): void {
    this.currentJid = this.createJid(userId);
    this.resource = 'WEB_' + Math.floor(Math.random() * 100000000000000);
    this.createClient(accessToken);
    this.bindEvents();
    this.client.connect();
  }

  public disconnect() {
    if (this.connected) {
      this.client.disconnect();
      this.connected = false;
    }
  }

  public sendMessage(userId: string, conversationId: string, body: string) {
    const message: XmppBodyMessage = {
      id: this.client.nextId(),
      to: this.createJid(userId),
      from: this.currentJid,
      thread: conversationId,
      type: 'chat',
      request: {
        xmlns: 'urn:xmpp:receipts',
      },
      body: body
    };
    this.client.sendMessage(message);
    this.onNewMessage(_.clone(message));
    this.trackingService.track(TrackingService.MESSAGE_SENT, {conversation_id: message.thread});
  }

  public sendConversationStatus(userId: string, conversationId: string) {
    this.client.sendMessage({
      to: this.createJid(userId),
      read: {
        xmlns: 'wallapop:thread:status'
      },
      thread: conversationId
    });
  }

  public searchHistory(thread?: string, refMessage?: string, start?: string): Observable<MessagesData> {
    return Observable.create((observer: Observer<MessagesData>) => {
      const queryId: string = this.client.nextId();
      const options: any = {
        from: this.currentJid,
        type: 'get',
        mam: {
          thread: thread,
          queryid: queryId,
          start: start,
          rsm: {
            max: 50
          }
        }
      };
      if (!start) {
        options.mam.rsm.before = refMessage || true;
      } else {
        options.mam.rsm.after = refMessage || true;
      }
      const query: Promise<any> = this.client.sendIq(options).then((response: any) => {
        if (response.mam.rsm.count === 0) {
          return observer.next({
            data: [],
            meta: {
              first: null,
              last: null,
              end: true
            }
          });
        }
        return response;
      }, (e) => {
        console.log(options);
        console.error(e);
        return observer.next({
          data: [],
          meta: {
            first: null,
            last: null,
            end: true
          }
        });
      });
      let messages: Message[] = [];
      let messagesCount: number = 0;
      setTimeout(() => {
        if (messagesCount === 0) {
          query.then((response) => {
            return observer.next({
              data: [],
              meta: {
                first: null,
                last: null,
                end: true
              }
            });
          });
        }
      }, 2000);
      this.client.on('stream:data', (data: any) => {
        if (data.xml.name === 'message' && data.xml.children[0].attrs.queryid === queryId) {
          messagesCount++;
          const message: any = this.xmlToMessage(data.xml);
          if (message.body) {
            const builtMessage: Message = this.buildMessage(message);
            messages.push(builtMessage);
          } else if (message.receivedId) {
            this.confirmedMessages.push(message.receivedId);
          }
          query.then((response: any) => {
            const meta: any = response.mam.rsm;
            if (message.ref === meta.last) {
              messages = this.checkReceivedMessages(messages);
              messages = this.confirmNotConfirmedMessages(messages);
              const metaObject: MetaInfo = {
                first: meta.first,
                last: meta.last,
                end: start ? meta.count === +meta.firstIndex + messagesCount : meta.firstIndex === '0'
              };
              if (!start && meta.count === +meta.firstIndex + messagesCount) {
                if (!this.firstMessageDate) {
                  this.firstMessageDate = message.date;
                }
                this.persistencyService.saveMetaInformation({last: meta.last, start: this.firstMessageDate});
              }
              return observer.next({
                data: messages,
                meta: metaObject
              });
            }
          });
        }
      });
    });
  }

  public isConnected(): Observable<boolean> {
    return Observable.create((observer) => {
      if (this.connected) {
        return observer.next(true);
      } else {
        this.connected$.subscribe((connected: boolean) => {
          if (connected) {
            return observer.next(true);
          }
        });
      }
    });
  }

  get connected(): boolean {
    return this._connected;
  }

  set connected(value: boolean) {
    this._connected = value;
    this.connected$.emit(value);
  }

  public debug() {
    this.client.on('*', (k, v) => console.debug(k, v));
  }

  private checkReceivedMessages(messages: Message[]): Message[] {
    messages.forEach((message: Message) => {
      const index: number = this.confirmedMessages.indexOf(message.id);
      if (index !== -1) {
        message.read = true;
        this.confirmedMessages.splice(index, 1);
      }
    });
    return messages;
  }

  private confirmNotConfirmedMessages(messages: Message[]) {
    messages.forEach((message: Message) => {
      if (!message.read) {
        this.sendMessageDeliveryReceipt(message.from, message.id, message.conversationId);
        message.read = true;
      }
    });
    return messages;
  }

  private createClient(accessToken: string): void {
    this.client = XMPP.createClient({
      jid: this.currentJid,
      resource: this.resource,
      password: accessToken,
      transport: 'websocket',
      wsURL: environment['wsUrl'],
      useStreamManagement: true,
      sendReceipts: false
    });
    this.client.use(this.receiptsPlugin);
    this.client.use(this.mamPlugin);
  }

  private bindEvents(): void {
    this.client.enableKeepAlive({
      interval: 30
    });
    this.client.on('message', (message: XmppBodyMessage) => {
      this.onNewMessage(message);
    });
    this.client.on('session:started', () => {
      this.client.sendPresence();
      this.client.enableCarbons();
      this.connected = true;
    });
    this.client.on('connected', () => {
      if (this._reconnecting) {
        this.connected = true;
        this._reconnecting = false;
      }
    });
    this.client.on('disconnected', (connection: any) => {
      this.connected = false;
      if (!connection.closing) {
        this._reconnecting = true;
        this.tryToReconnect();
        this.eventService.emit(EventService.CONNECTION_ERROR);
      }
    });
  }

  private tryToReconnect() {
    if (!this.reconnectInterval) {
      this.reconnectInterval = setInterval(() => {
        if (this.connected) {
          this.eventService.emit(EventService.CONNECTION_RESTORED);
          clearInterval(this.reconnectInterval);
        } else {
          this.client.connect();
        }
      }, 5000);
    }
  }

  private onNewMessage(message: XmppBodyMessage) {
    if (message.body || message.timestamp || message.carbonSent) {
      const builtMessage: Message = this.buildMessage(message);
      this.persistencyService.saveMetaInformation({
          last: null,
          start: builtMessage.date.toISOString()
        }
      );
      if (!message.timestamp || message.carbonSent) {
        this.eventService.emit(EventService.NEW_MESSAGE, builtMessage);
        if (message.from !== this.currentJid && message.request) {
          this.sendMessageDeliveryReceipt(message.from, message.id, message.thread);
        }
      } else {
        this.eventService.emit(EventService.NEW_MESSAGE, builtMessage, true);
      }
    }
  }

  private buildMessage(message: XmppBodyMessage) {
    if (message.carbonSent) {
      message = message.carbonSent.forwarded.message;
    }
    if (message.timestamp) {
      message.date = new Date(message.timestamp.body).getTime();
    } else {
      if (!message.date) {
        message.date = new Date().getTime();
      }
    }
    let messageId: string = null;
    if (message.timestamp && message.receipt) {
      messageId = message.receipt;
    } else {
      messageId = message.id;
    }
    return new Message(messageId, message.thread, message.body, (message.from.full || message.from), new Date(message.date));
  }

  private sendMessageDeliveryReceipt(to: any, id: string, thread: string) {
    this.client.sendMessage({
      to: to,
      type: 'chat',
      thread: thread,
      received: {
        xmlns: 'urn:xmpp:receipts',
        id: id
      }
    });
  }

  private receiptsPlugin(client: XMPPClient, stanzas: any) {
    const types: any = stanzas.utils;
    const timestamp: any = stanzas.define({
      namespace: 'wallapop:message:timestamp',
      name: 'timestamp',
      element: 'timestamp',
      fields: {
        body: {
          get: function getBody() {
            return this.xml.children[0];
          }
        },
      }
    });
    const read: any = stanzas.define({
      name: 'read',
      element: 'read',
      fields: {
        xmlns: types.attribute('xmlns'),
      }
    });
    const received: any = stanzas.define({
      name: 'received',
      element: 'received',
      fields: {
        xmlns: types.attribute('xmlns'),
        id: types.attribute('id')
      }
    });
    const request: any = stanzas.define({
      name: 'request',
      element: 'request',
      fields: {
        xmlns: types.attribute('xmlns')
      }
    });
    stanzas.withMessage(function (Message: any) {
      stanzas.extend(Message, read);
      stanzas.extend(Message, timestamp);
      stanzas.extend(Message, received);
      stanzas.extend(Message, request);
    });
  };

  private mamPlugin(client: XMPPClient, stanzas: any) {
    const types: any = stanzas.utils;
    const MAMQuery: any = stanzas.define({
      name: 'mam',
      namespace: 'urn:xmpp:mam:tmp',
      element: 'query',
      fields: {
        queryid: types.attribute('queryid'),
        start: types.dateSub('urn:xmpp:mam:tmp', 'start'),
        end: types.dateSub('urn:xmpp:mam:tmp', 'end'),
        thread: types.dateSub('urn:xmpp:mam:tmp', 'thread'),
      }
    });
    stanzas.withIq(function (Iq: any) {
      stanzas.extend(Iq, MAMQuery);
    });
    stanzas.withDefinition('set', 'http://jabber.org/protocol/rsm', function (RSM: any) {
      stanzas.extend(MAMQuery, RSM);
    });
  };

  private createJid(userId: string): string {
    return userId + '@' + environment['xmppDomain'];
  }

  private xmlToMessage(xml: any) {
    const forwarded: any = xml.children[0].children[0];
    /* istanbul ignore else  */
    if (forwarded) {
      const delay: any = _.find(forwarded.children, {name: 'delay'});
      const message: any = _.find(forwarded.children, {name: 'message'});
      /* istanbul ignore else  */
      if (message && delay) {
        const body: any = _.find(message.children, {name: 'body'});
        const thread: any = _.find(message.children, {name: 'thread'});
        const received: any = _.find(message.children, {name: 'received'});
        return {
          id: message.attrs.id,
          from: message.attrs.from,
          to: message.attrs.to,
          date: delay.attrs.stamp,
          body: body ? body.children[0] : null,
          thread: thread ? thread.children[0] : null,
          ref: xml.children[0].attrs.id,
          receivedId: received ? received.attrs.id : null
        };
      }
    }
  }
}
