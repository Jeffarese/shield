/* tslint:disable:no-unused-variable */

import { Call } from './call';
import { User } from '../user/user';
import { Item } from '../item/item';
import {
  CALL_ID, CALL_DATE, CALL_PHONE, CALL_DURATION, CALL_STATUS
} from '../../../test/fixtures/call.fixtures';
import { MOCK_USER } from '../../../test/fixtures/user.fixtures';
import { MOCK_ITEM } from '../../../test/fixtures/item.fixtures';

describe('Call', () => {

  let call: Call;

  beforeEach(() => {
    call = new Call(
      CALL_ID,
      1,
      CALL_DATE,
      CALL_PHONE,
      CALL_DURATION,
      CALL_STATUS,
      MOCK_USER,
      MOCK_ITEM,
      [],
      true
    );
  });

  it('should create an instance', () => {
    expect(call).toBeDefined();
    expect(call.id).toBe(CALL_ID);
    expect(call.modifiedDate).toBe(CALL_DATE);
    expect(call.phone).toBe(CALL_PHONE);
    expect(call.callDuration).toBe(CALL_DURATION);
    expect(call.callStatus).toBe(CALL_STATUS);
  });

  describe('Getter and setters', () => {

    it('should set the User object', () => {
      expect(call.user).toBeDefined();
      expect(call.user instanceof User).toBeTruthy();
    });

    it('should set the Item object', () => {
      expect(call.item).toBeDefined();
      expect(call.item instanceof Item).toBeTruthy();
    });

    it('should set the modified date', () => {
      call.modifiedDate = CALL_DATE;
      expect(call.modifiedDate).toEqual(CALL_DATE);
    });


  });

});
