import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class EventService {

  public static USER_LOGIN: string = 'loginEvent';
  public static FORM_LOGIN: string = 'manualLoginEvent';
  public static USER_LOGOUT: string = 'logoutEvent';
  public static NEW_MESSAGE: string = 'newMessage';
  public static MESSAGE_ADDED: string = 'messageAdded';
  public static CONVERSATION_READ: string = 'conversationRead';
  public static CONNECTION_ERROR: string = 'connectionError';
  public static CONNECTION_RESTORED: string = 'connectionRestored';
  public static CLOSE_EXPANDED_CALLS: string = 'closeExpandedCalls';
  public static CONVERSATION_ARCHIVED: string = 'conversationArchived';
  public static CONVERSATION_UNARCHIVED: string = 'conversationUnarchived';
  public static LEAD_ARCHIVED: string = 'leadArchived';
  public static ITEMS_PURCHASED: string = 'itemsPurchased';
  public static ITEM_SOLD: string = 'itemSold';

  private subjects: any = {};

  constructor(private zone: NgZone) {
  }

  public emit(eventName: string, ...args: any[]): void {
    this.createSubject(eventName);
    this.subjects[eventName].next(args);
  }

  public subscribe(eventName: string, callback: Function): Subscription {
    this.createSubject(eventName);
    return this.subjects[eventName].subscribe((args: any) => {
      callback(...args);
    });
  }

  public unsubscribeAll(eventName: string) {
    this.subjects[eventName] = null;
  }

  private createSubject(eventName: string) {
    if (!this.subjects[eventName]) {
      this.subjects[eventName] = new Subject().share();
    }
  }
}
