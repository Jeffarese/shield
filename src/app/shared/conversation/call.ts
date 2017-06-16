import { User } from '../user/user';
import { Item } from '../item/item';
import { Message } from '../message/message';
import { Lead } from './lead';
import { SurveyResponse } from './lead-response.interface';

export class Call extends Lead {

  constructor(id: string,
              legacyId: number,
              modifiedDate: number,
              phone: string,
              private _callDuration: number,
              private _callStatus: string,
              user?: User,
              item?: Item,
              messages: Array<Message> = [],
              archived?: boolean,
              surveyResponses: SurveyResponse[] = []) {
    super(id, legacyId, modifiedDate, user, item, messages, phone, surveyResponses);
    this.archived = archived;
  }

  get callDuration(): number {
    return this._callDuration;
  }

  get callStatus(): string {
    return this._callStatus;
  }
}
