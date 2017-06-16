/* tslint:disable:no-unused-variable */

import { Conversation } from './conversation';
import { User } from '../user/user';
import { Item } from '../item/item';
import { Message } from '../message/message';
import { createMessagesArray } from '../../../test/fixtures/message.fixtures';
import {
  CONVERSATION_ID, CONVERSATION_DATE, MOCK_CONVERSATION,
  CONVERSATION_PHONE
} from '../../../test/fixtures/conversation.fixtures';
import { USER_ID } from '../../../test/fixtures/user.fixtures';
import { ITEM_ID } from '../../../test/fixtures/item.fixtures';

describe('Conversation', () => {

  let conversation: Conversation;

  beforeEach(() => {
    conversation = MOCK_CONVERSATION(undefined, undefined, CONVERSATION_PHONE);
  });

  it('should create an instance', () => {
    expect(conversation).toBeDefined();
    expect(conversation.id).toBe(CONVERSATION_ID);
    expect(conversation.modifiedDate).toBe(CONVERSATION_DATE);
    expect(conversation.phone).toBe(CONVERSATION_PHONE);
    expect(conversation.expectedVisit).toBeFalsy();
  });

  describe('Getter and setters', () => {

    it('should set the User object', () => {
      expect(conversation.user).toBeDefined();
      expect(conversation.user instanceof User).toBeTruthy();
    });

    it('should set the Item object', () => {
      expect(conversation.item).toBeDefined();
      expect(conversation.item instanceof Item).toBeTruthy();
    });


    it('should set the modified date', () => {
      conversation.modifiedDate = CONVERSATION_DATE;
      expect(conversation.modifiedDate).toEqual(CONVERSATION_DATE);
    });

    it('should set the array of messages and get it', () => {
      conversation.messages = createMessagesArray(1);
      expect(conversation.messages.length).toBe(1);
      expect(conversation.messages[0] instanceof Message).toBeTruthy();
    });

    it('should set the last message ref', () => {
      conversation.lastMessageRef = 'test';
      expect(conversation.lastMessageRef).toBe('test');
    });

    it('should set oldMessagesLoaded', () => {
      conversation.oldMessagesLoaded = true;
      expect(conversation.oldMessagesLoaded).toBeTruthy();
    });

  });

  it('should set messages', () => {
    let messages: Message[] = createMessagesArray(4);
    let conv: Conversation = new Conversation(
      CONVERSATION_ID,
      1,
      CONVERSATION_DATE,
      false,
      new User(USER_ID),
      new Item(ITEM_ID, 1, USER_ID),
      messages);
    expect(conv.messages).toEqual(messages);
  });

});
