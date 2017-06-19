import { MESSAGE_MAIN } from './message.fixtures';
import { Message } from '../../app/shared/message/message';

export const MOCK_DB_FILTERED_RESPONSE: any = [
  {
    doc: {
      '_id': MESSAGE_MAIN.id,
      'conversationId': MESSAGE_MAIN.thread,
      'message': MESSAGE_MAIN.body,
      'from': MESSAGE_MAIN.from,
      'date': MESSAGE_MAIN.date,
      'read': true
    }
  },
  {
    doc: {
      '_id': 'message2',
      'conversationId': MESSAGE_MAIN.thread,
      'message': 'Message 2',
      'from': MESSAGE_MAIN.from,
      'date': MESSAGE_MAIN.date + 1,
      'read': true
    }
  },
];

export const MOCK_DB_RESPONSE: any = {
  offset: 1,
  total_rows: 3,
  rows: [
    {
      doc: {
        '_id': MESSAGE_MAIN.id,
        'conversationId': MESSAGE_MAIN.thread,
        'message': MESSAGE_MAIN.body,
        'from': MESSAGE_MAIN.from,
        'date': MESSAGE_MAIN.date,
        'read': true
      }
    },
    {
      doc: {
        '_id': 'message2',
        'conversationId': MESSAGE_MAIN.thread,
        'message': 'Message 2',
        'from': MESSAGE_MAIN.from,
        'date': MESSAGE_MAIN.date + 1,
        'read': true
      }
    },
    {
      doc: {
        '_id': 'xv-123871',
        'conversationId': 'random',
        'message': 'Hola',
        'from': 'pj9ylwknvv6e@dock9.wallapop.com/1.15.0-d1610071212_ONE-E1001_22_XZAmN_RT_DEBUG',
        'date': '2016-10-10T15:30:27.000Z',
        'read': true
      }
    }
  ]
};

export const MOCK_DB_META: any = {
  data: {
    last: 'last',
    start: '2016-10-10T15:30:27.000Z',
    end: true
  }
};

/* istanbul ignore next */
export class MockedPersistencyService {
  get messagesDb(): any {
    return new MockedMessagesDb();
  }

  get conversationsDb(): any {
    return new MockedConversationsDb();
  }

  public getMessages(conversationId: string) {
  }

  public saveMessages(messages: Array<Message> | Message) {
  }

  public saveMetaInformation(data: any) {
  }

  public getMetaInformation() {
  }

  public saveUnreadMessages(conversationId: string, unreadMessages: number) {
  }

  public getUnreadMessages(conversationId: string) {
  }

  public resetCache() {
  }

  public updateMessageDate() {
  }
}

/* istanbul ignore next */
export class MockedMessagesDb {

  get(): any {
  }

  bulkDocs(): any {
  }

  put(): any {
  }

  allDocs(): any {
  }

}
/* istanbul ignore next */
export class MockedConversationsDb {

  get(): any {
  }

  bulkDocs(): any {
  }

  put(): any {
  }

  allDocs(): any {
  }

}
