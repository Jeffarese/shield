/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { EventService } from './event.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import createSpy = jasmine.createSpy;

const EVENT_NAME: string = 'MockEventName';
const EVENT_DATA: any = {number: 5};
const EVENT_CALLBACK: Function = createSpy('EVENT_CALLBACK');
let service: EventService;

describe('Service: Event', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventService],
    });
    service = TestBed.get(EventService);
  });

  it('should instantiate the service', () => {
    expect(service).toBeTruthy();
  });

  describe('emit', () => {
    it('should call eventEmitter.emit with the provided params', () => {
      service['subjects'][EVENT_NAME] = new Subject();
      spyOn(service['subjects'][EVENT_NAME], 'next');
      service.emit(EVENT_NAME, EVENT_DATA);
      expect(service['subjects'][EVENT_NAME].next).toHaveBeenCalledWith([EVENT_DATA]);
    });
  });

  describe('subscribe', () => {
    it('should subscribe to the right subject', () => {
      service.subscribe(EVENT_NAME, EVENT_CALLBACK);
      expect(EVENT_CALLBACK).not.toHaveBeenCalled();
      service.emit(EVENT_NAME, EVENT_DATA);
      expect(EVENT_CALLBACK).toHaveBeenCalledWith(EVENT_DATA);
      expect(EVENT_CALLBACK).toHaveBeenCalledTimes(1);
    });
    it('should return a subscription', () => {
      let subscription: Subscription = service.subscribe(EVENT_NAME, EVENT_CALLBACK);
      expect(subscription instanceof Subscription).toBeTruthy();
    });
  });

  describe('unsubscribeAll', () => {
    it('should reset event', () => {
      service.subscribe(EVENT_NAME, EVENT_CALLBACK);
      expect(service['subjects'][EVENT_NAME]).toBeTruthy();
      service.unsubscribeAll(EVENT_NAME);
      expect(service['subjects'][EVENT_NAME]).toBeNull();
    });
  });

});
