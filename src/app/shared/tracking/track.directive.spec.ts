/* tslint:disable:no-unused-variable */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TrackDirective } from './track.directive';
import { TrackingService } from './tracking.service';
import { MockTrackingService, TRACKING_EVENT, TRACKING_PARAMS } from '../../../test/fixtures/tracking.fixtures';

@Component({
  template: `<a [tslTrack]="event" [params]="params"></a>`
})
class TestComponent {
  event: string;
  params: any;
}

describe('Directive: Track', () => {

  let fixture: ComponentFixture<TestComponent>;
  let element: DebugElement;
  let trackingService: TrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TrackDirective,
        TestComponent
      ],
      providers: [
        {provide: TrackingService, useClass: MockTrackingService}
      ]
    });
    fixture = TestBed.createComponent(TestComponent);
    trackingService = TestBed.get(TrackingService);
    element = fixture.debugElement.queryAll(By.directive(TrackDirective))[0];
    spyOn(trackingService, 'track');
  });

  it('should track the click', () => {
    fixture.componentInstance.event = TRACKING_EVENT;
    fixture.componentInstance.params = TRACKING_PARAMS;
    fixture.detectChanges();
    element.triggerEventHandler('click', {});
    expect(trackingService.track).toHaveBeenCalledWith(TrackingService[TRACKING_EVENT], TRACKING_PARAMS);
  });

});
