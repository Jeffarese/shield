/* tslint:disable:no-unused-variable */

import { Message } from './message';
import { MESSAGE_MAIN, MOCK_MESSAGE } from '../../../test/fixtures/message.fixtures';
import { MOCK_USER } from '../../../test/fixtures/user.fixtures';
import * as _ from 'lodash';

describe('Message', () => {
  it('should create an instance', () => {
    expect(MOCK_MESSAGE).toBeTruthy();
  });
  describe('get id', () => {
    it('should retrieve the message id', () => {
      expect(MOCK_MESSAGE.id).toEqual(MESSAGE_MAIN.id);
    });
  });
  describe('get conversation id', () => {
    it('should retrieve the message id', () => {
      expect(MOCK_MESSAGE.conversationId).toEqual(MESSAGE_MAIN.thread);
    });
  });
  describe('get message', () => {
    it('should retrieve the message text', () => {
      expect(MOCK_MESSAGE.message).toEqual(MESSAGE_MAIN.body);
    });
  });
  describe('get user', () => {
    it('should retrieve the message user', () => {
      let message: Message = _.clone(MOCK_MESSAGE);
      message.user = MOCK_USER;
      expect(message.user).toEqual(MOCK_USER);
    });
  });
});
