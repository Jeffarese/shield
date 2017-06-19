import { Message } from '../../app/shared/message/message';
import { USER_ID } from './user.fixtures';

export const MESSAGE_MAIN: any = {
  'body': 'Message body',
  'id': 'iVQYE-1310',
  'lang': 'en',
  'requestReceipt': true,
  'thread': 'w67dl03g3w6x',
  'from': USER_ID + '@host',
  'date': new Date('2016-12-12 13:00').getTime()
};
export const MESSAGE_MAIN_UPDATED: any = {
  'body': 'Message body',
  'id': 'random',
  'receipt': 'iVQYE-1310',
  'lang': 'en',
  'requestReceipt': true,
  'thread': 'w67dl03g3w6x',
  'from': USER_ID + '@host',
  'date': new Date('2016-12-12 13:02').getTime()
};

export function createMessagesArray(total: number) {
  let messages: Message[] = [];
  for (let i: number = 1; i <= total; i++) {
    messages.push(new Message(`${MESSAGE_MAIN.id}${i}`,
      MESSAGE_MAIN.thread,
      MESSAGE_MAIN.body,
      MESSAGE_MAIN.from,
      new Date()));
  }
  return messages;
}

export const MOCK_MESSAGE: Message = new Message(
  MESSAGE_MAIN.id,
  MESSAGE_MAIN.thread,
  MESSAGE_MAIN.body,
  MESSAGE_MAIN.from,
  MESSAGE_MAIN.date,
  true
);

export const MOCK_RANDOM_MESSAGE: Message = new Message(
  'random',
  MESSAGE_MAIN.thread,
  MESSAGE_MAIN.body,
  MESSAGE_MAIN.from,
  MESSAGE_MAIN.date,
  true
);
