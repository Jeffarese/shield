import { MESSAGE_MAIN } from './message.fixtures';
import { USER_ID } from './user.fixtures';
import { User } from '../../app/shared/user/user';
import { ITEM_ID, ITEM_LEGACY_ID } from './item.fixtures';
import { Item } from '../../app/shared/item/item';
import { Call } from '../../app/shared/conversation/call';
import { CallResponse } from '../../app/shared/conversation/call-response.interface';
import { SURVEY_RESPONSES } from './conversation.fixtures';

export const CALL_ID: string = MESSAGE_MAIN.thread;
export const CALL_PHONE: string = '123.456.789';
export const CALL_DURATION: number = 10;
export const CALL_STATUS: string = 'ANSWERED';

export const CALLS_DATA: CallResponse[] = [{
  'legacy_id': 500000002,
  'id': 'pzp9m08vx563',
  'modified_date': 1474988119,
  'user_id': 'l1kmzn82zn3p',
  'item_id': '9jd7ryx5odjk',
  'buyer_phone_number': CALL_PHONE,
  'call_duration': CALL_DURATION,
  'call_status': CALL_STATUS,
  'survey_responses': SURVEY_RESPONSES
}, {
  'legacy_id': 500000002,
  'id': 'pzp9m08vx563',
  'modified_date': 1474988119,
  'user_id': 'l1kmzn82zn3p',
  'item_id': '9jd7ryx5odjk',
  'buyer_phone_number': CALL_PHONE,
  'call_duration': CALL_DURATION,
  'call_status': CALL_STATUS,
  'survey_responses': SURVEY_RESPONSES
}];

export const CALL_DATE: number = new Date().getTime();

export const MOCK_CALL: Function = (id: string = CALL_ID, userId: string = USER_ID, phone: string = CALL_PHONE, status: string = CALL_STATUS): Call => {
  return new Call(id, 1, CALL_DATE, phone, CALL_DURATION, status, new User(userId), new Item(ITEM_ID, ITEM_LEGACY_ID, USER_ID), [], false, SURVEY_RESPONSES);
};

export function createCallsArray(total: number, status?: string, offset: number = 0) {
  let calls: Call[] = [];
  for (let i: number = 1; i <= total; i++) {
    calls.push(MOCK_CALL((i + offset).toString(), undefined, undefined, status));
  }
  return calls;
}
