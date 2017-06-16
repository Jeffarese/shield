import { TRACKING_EVENT } from '../../../test/fixtures/tracking.fixtures';
import { TrackingEvent } from './tracking-event';
describe('TrackingEvent', () => {
  it('should create an instance', () => {
    expect(TRACKING_EVENT).toBeTruthy();
    expect(TRACKING_EVENT instanceof TrackingEvent).toBeTruthy();
  });
  describe('setDeviceInfo', () => {
    it('should set the deviceInfo with the given parameters', () => {
      TRACKING_EVENT.setDeviceInfo({}, 'Windows');
      expect(TRACKING_EVENT['sessions'][0]['device']).toEqual({
        platform: 'tesla',
        model: 'PC',
        screenwidth: '1366',
        screenheight: '768',
        locale: navigator.language,
        type: 's',
        os: 'Windows'
      });
    });
  });
  describe('setAttributes', () => {
    it('should set the attributes of the event to the given ones', () => {
      TRACKING_EVENT.setAttributes({product_id: 5});
      expect(TRACKING_EVENT['sessions'][0]['events'][0]['attributes']).toEqual({product_id: 5});
    });
  });
  describe('setEntryPoint', () => {
    it('should set the entryPoint using the number from the constant', () => {
      expect(TRACKING_EVENT['sessions'][0].entryPoint).toBe('89')
    });
  });
});
