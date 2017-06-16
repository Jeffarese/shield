import { User } from '../user/user';
import { Item } from '../item/item';
import { Message } from '../message/message';
import { Lead } from './lead';
import { SurveyResponse } from './lead-response.interface';

export class Conversation extends Lead {

  constructor(id: string,
              legacyId: number,
              modifiedDate: number,
              private _expectedVisit: boolean = false,
              user?: User,
              item?: Item,
              messages: Array<Message> = [],
              phone?: string,
              surveyResponses: SurveyResponse[] = []) {
    super(id, legacyId, modifiedDate, user, item, messages, phone, surveyResponses);
  }

  get expectedVisit(): boolean {
    return this._expectedVisit;
  }
}
