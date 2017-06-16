/* tslint:disable:no-unused-variable */

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NotificationService, NOTIFICATION_DURATION } from './notification.service';
import { PushNotificationsService } from 'angular2-notifications/src/push-notifications.service';
import { Observable } from 'rxjs/Observable';
import { TrackingService } from '../tracking/tracking.service';
import { I18nService } from '../i18n/i18n.service';
import { MockTrackingService } from '../../../test/fixtures/tracking.fixtures';
import { Message } from '../message/message';
import { MOCK_MESSAGE } from '../../../test/fixtures/message.fixtures';
import { MOCK_USER, USER_DATA } from '../../../test/fixtures/user.fixtures';
import { PLACEHOLDER_AVATAR, User } from '../user/user';

let service: NotificationService;
let notification: PushNotificationsService;
let trackingService: TrackingService;

class MockedPushNotificationsService {
  requestPermission() {
  }

  create() {
  }
}

describe('Service: Notification', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        I18nService,
        {provide: TrackingService, useClass: MockTrackingService},
        {provide: PushNotificationsService, useClass: MockedPushNotificationsService}
      ]
    });
    service = TestBed.get(NotificationService);
    notification = TestBed.get(PushNotificationsService);
    trackingService = TestBed.get(TrackingService);

  });

  describe('init', () => {

    it('should listen to visibility event and set hidden', () => {
      spyOn(Visibility, 'change').and.callFake((callback: Function) => callback());
      spyOn(Visibility, 'hidden').and.returnValue(true);
      service.init();
      expect(Visibility.change).toHaveBeenCalled();
      expect(service['hidden']).toBeTruthy();
    });

    it('should call requestPermission', () => {
      spyOn(notification, 'requestPermission');
      service.init();
      expect(notification.requestPermission).toHaveBeenCalled();
    });

  });

  describe('sendBrowserNotification', () => {

    let message: Message;
    const MOCKED_NOTIFICATION: any = {
      notification: {
        close() {
        }
      }
    };

    beforeEach(() => {
      spyOn(MOCKED_NOTIFICATION.notification, 'close');
      spyOn(notification, 'create').and.returnValue(Observable.of(MOCKED_NOTIFICATION));
      message = MOCK_MESSAGE;
      message.user = MOCK_USER;
    });

    describe('if hidden', () => {
      beforeEach(() => {
        service['hidden'] = true;
      });

      it('should create a notification if browser is hidden', () => {
        service.sendBrowserNotification(MOCK_MESSAGE);
        expect(notification.create).toHaveBeenCalledWith('New message from ' + message.user.microName, {
          body: message.message,
          icon: message.user.image.urls_by_size.medium
        });
      });

      it('should create a notification with placeholder image if no user image', () => {
        message.user = new User(
          USER_DATA.id,
          USER_DATA.micro_name
        );
        service.sendBrowserNotification(message);
        expect(notification.create).toHaveBeenCalledWith('New message from ' + USER_DATA.micro_name, {
          body: message.message,
          icon: PLACEHOLDER_AVATAR
        });
      });

      it('should close the notification after creating', fakeAsync(() => {
        service.sendBrowserNotification(MOCK_MESSAGE);
        tick(NOTIFICATION_DURATION + 1000);
        expect(MOCKED_NOTIFICATION.notification.close).toHaveBeenCalled();
      }));
      it('should track the MessageNotified event', fakeAsync(() => {
        spyOn(trackingService, 'track');
        service.sendBrowserNotification(MOCK_MESSAGE);
        tick(NOTIFICATION_DURATION + 1000);
        expect(trackingService.track).toHaveBeenCalledWith(TrackingService.MESSAGE_NOTIFIED,
          {conversation_id: MOCK_MESSAGE.conversationId});
      }));
    });

    describe('if visible', () => {

      it('should not create a notification if browser is visible', () => {
        service['hidden'] = false;
        service.sendBrowserNotification(MOCK_MESSAGE);
        expect(notification.create).not.toHaveBeenCalled();
      });

    });


  });

});
