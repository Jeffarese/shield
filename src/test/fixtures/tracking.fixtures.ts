import { TrackingEventBase } from '../../app/shared/tracking/tracking-event-base.interface';
import { TrackingEvent } from '../../app/shared/tracking/tracking-event';
import { TrackingService } from '../../app/shared/tracking/tracking.service';

/* istanbul ignore next */
export class MockTrackingService {

  constructor() {
  }

  createNewEvent(event: TrackingEventBase, attributes?: any) {
  }

  track(event: TrackingEventBase, params?: any) {
  }

}

export const TRACKING_EVENT: TrackingEvent = new TrackingEvent({
    screen: {
      width: 1366,
      height: 768
    },
    locale: 'es'
  },
  'chat',
  'userId',
  '2016-04-05 10:59:39.977',
  TrackingService.PRODUCT_DELETED);
