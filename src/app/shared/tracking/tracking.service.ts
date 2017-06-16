import { Injectable } from '@angular/core';
import { TrackingEvent } from './tracking-event';
import { NavigatorService } from '../navigator/navigator.service';
import { HttpService } from '../http/http.service';
import { TrackingEventBase } from './tracking-event-base.interface';
import { WindowRef } from '../window/window.service';
import { UUID } from 'angular2-uuid';
import { Router } from '@angular/router';
import { CategoryIds } from './category-ids.interface';
import { UserService } from '../user/user.service';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

const CATEGORY_IDS: CategoryIds = {
  ProConversations: '24',
  ProInventoryManagement: '25',
  ProLogin: '26',
  ProNotifications: '27',
  ProPhoneManagement: '28',
  ProStatistics: '29',
  Repport: '13'
};
@Injectable()
export class TrackingService {
  public static CONVERSATION_PROCESSED: TrackingEventBase = {
    name: '350',
    category: CATEGORY_IDS['ProConversations']
  };
  public static CONVERSATION_LIST_ACTIVE_LOADED: TrackingEventBase = {
    name: '351',
    category: CATEGORY_IDS['ProConversations']
  };
  public static CONVERSATION_READ: TrackingEventBase = {
    name: '352',
    category: CATEGORY_IDS['ProConversations']
  };
  public static MESSAGE_NOTIFIED: TrackingEventBase = {
    name: '353',
    category: CATEGORY_IDS['ProNotifications']
  };
  public static MESSAGE_SENT: TrackingEventBase = {
    name: '354',
    category: CATEGORY_IDS['ProConversations']
  };
  public static MY_PROFILE_LOGGED_IN: TrackingEventBase = {
    name: '355',
    category: CATEGORY_IDS['ProLogin']
  };
  public static MY_PROFILE_LOGGED_OUT: TrackingEventBase = {
    name: '356',
    category: CATEGORY_IDS['ProLogin']
  };
  public static PRODUCT_DELETED: TrackingEventBase = {
    name: '357',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_LIST_ACTIVE_VIEWED: TrackingEventBase = {
    name: '358',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_LIST_BULK_DELETED: TrackingEventBase = {
    name: '359',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_LIST_BULK_RESERVED: TrackingEventBase = {
    name: '360',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_LIST_BULK_SOLD: TrackingEventBase = {
    name: '370',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_LIST_BULK_UNSELECTED: TrackingEventBase = {
    name: '371',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_LIST_FILTERED_BY_TEXT: TrackingEventBase = {
    name: '372',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_LIST_LOADED: TrackingEventBase = {
    name: '373',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_LIST_ORDERED_BY: TrackingEventBase = {
    name: '374',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_LIST_SOLD_VIEWED: TrackingEventBase = {
    name: '375',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_REPPORTED: TrackingEventBase = {
    name: '379',
    category: CATEGORY_IDS['Repport']
  };
  public static PRODUCT_RESERVED: TrackingEventBase = {
    name: '380',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_SELECTED: TrackingEventBase = {
    name: '381',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_SOLD: TrackingEventBase = {
    name: '382',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_UNRESERVED: TrackingEventBase = {
    name: '383',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_UN_SELECTED: TrackingEventBase = {
    name: '384',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static PRODUCT_VIEWED: TrackingEventBase = {
    name: '385',
    category: CATEGORY_IDS['ProInventoryManagement']
  };
  public static USER_PROFILE_REPPORTED: TrackingEventBase = {
    name: '386',
    category: CATEGORY_IDS['Repport']
  };
  public static USER_PROFILE_VIEWED: TrackingEventBase = {
    name: '387',
    category: CATEGORY_IDS['ProConversations']
  };
  public static PHONE_LEAD_LIST_ACTIVE_LOADED: TrackingEventBase = {
    name: '392',
    category: CATEGORY_IDS['ProPhoneManagement']
  };
  public static PHONE_LEAD_PROCESSED: TrackingEventBase = {
    name: '393',
    category: CATEGORY_IDS['ProPhoneManagement']
  };
  public static STATISTIC_VIEWED_GENERAL: TrackingEventBase = {
    name: '394',
    category: CATEGORY_IDS['ProStatistics']
  };
  public static PHONE_LEAD_VIEWED_CONVERSATION: TrackingEventBase = {
    name: '395',
    category: CATEGORY_IDS['ProPhoneManagement']
  };
  public static PHONE_LEAD_OPENED: TrackingEventBase = {
    name: '396',
    category: CATEGORY_IDS['ProPhoneManagement']
  };
  public static CONVERSATION_LIST_PROCESSED_LOADED: TrackingEventBase = {
    name: '397',
    category: CATEGORY_IDS['ProConversations']
  };
  public static CONVERSATION_SELLING_CAR_VIEWED: TrackingEventBase = {
    name: '398',
    category: CATEGORY_IDS['ProConversations']
  };
  public static PHONE_LEAD_LIST_PROCESSED_LOADED: TrackingEventBase = {
    name: '399',
    category: CATEGORY_IDS['ProPhoneManagement']
  };
  public static CONVERSATION_LIST_ALL_PROCESSED: TrackingEventBase = {
    name: '400',
    category: CATEGORY_IDS['ProConversations']
  };
  public static PHONE_LEAD_LIST_ALL_PROCESSED: TrackingEventBase = {
    name: '401',
    category: CATEGORY_IDS['ProPhoneManagement']
  };
  public static TRACKING_SESSION_UUID: string = UUID.UUID();
  private TRACKING_KEY: string = 'AgHqp1anWv7g3JGMA78CnlL7NuB7CdpYrOwlrtQV';
  private preClickStreamURL: string = 'https://precollector.wallapop.com/clickstream.json/sendEvents';
  private proClickStreamURL: string = 'https://collector.wallapop.com/clickstream.json/sendEvents';
  private sessionStartTime: string = null;

  constructor(private navigatorService: NavigatorService,
              private http: HttpService,
              private userService: UserService,
              private winRef: WindowRef,
              private router: Router) {
    this.setSessionStartTime();
  }

  track(event: TrackingEventBase, attributes?: any) {
    const newEvent: TrackingEvent = this.createNewEvent(event, attributes);
    delete newEvent['sessions'][0]['window'];
    let stringifiedEvent: string = JSON.stringify(newEvent);
    let sha1Body: string = CryptoJS.SHA1(stringifiedEvent + this.TRACKING_KEY);
    if (environment.production) {
      this.http.postNoBase(this.proClickStreamURL, stringifiedEvent, sha1Body).subscribe();
    } else {
      this.http.postNoBase(this.preClickStreamURL, stringifiedEvent, sha1Body).subscribe();
    }
  }

  private setSessionStartTime() {
    let now = new Date();
    this.sessionStartTime =
      `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.toLocaleTimeString()}.${now.getMilliseconds()}`;
  }


  private createNewEvent(event: TrackingEventBase, attributes?: any) {
    const newEvent: TrackingEvent = new TrackingEvent(this.winRef.nativeWindow,
      this.router.url,
      this.userService.user.id,
      this.sessionStartTime,
      event);
    newEvent.setDeviceInfo(this.navigatorService.browserName, this.navigatorService.OSName);
    if (attributes) {
      newEvent.setAttributes(attributes);
    }
    return newEvent;
  }

}
