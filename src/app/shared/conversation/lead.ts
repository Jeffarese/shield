import { Message } from '../message/message';
import { Item } from '../item/item';
import { User } from '../user/user';
import { SurveyResponse } from './lead-response.interface';

export abstract class Lead {

  private _lastMessageRef: string;
  private _oldMessagesLoaded: boolean;
  private _unreadMessages: number = 0;
  private _active: boolean;
  private _archived: boolean = false;

  constructor(private _id: string,
              private _legacyId: number,
              private _modifiedDate: number,
              private _user?: User,
              private _item?: Item,
              private _messages: Array<Message> = [],
              private _phone?: string,
              private _surveyResponses: SurveyResponse[] = []) {
  }

  set modifiedDate(value: number) {
    this._modifiedDate = value;
  }

  set messages(value: Array<Message>) {
    this._messages = value;
  }

  get messages(): Array<Message> {
    return this._messages;
  }

  get id(): string {
    return this._id;
  }

  get legacyId(): number {
    return this._legacyId;
  }

  set legacyId(value: number) {
    this._legacyId = value;
  }

  get user(): User {
    return this._user;
  }

  get modifiedDate(): number {
    return this._modifiedDate;
  }

  get item(): Item {
    return this._item;
  }

  get lastMessageRef(): string {
    return this._lastMessageRef;
  }

  set lastMessageRef(value: string) {
    this._lastMessageRef = value;
  }

  get oldMessagesLoaded(): boolean {
    return this._oldMessagesLoaded;
  }

  set oldMessagesLoaded(value: boolean) {
    this._oldMessagesLoaded = value;
  }

  get unreadMessages(): number {
    return this._unreadMessages;
  }

  set unreadMessages(value: number) {
    this._unreadMessages = value;
  }

  get active(): boolean {
    return this._active;
  }

  set active(value: boolean) {
    this._active = value;
  }

  get phone(): string {
    return this._phone;
  }

  set phone(value: string) {
    this._phone = value;
  }

  get archived(): boolean {
    return this._archived;
  }

  set archived(value: boolean) {
    this._archived = value;
  }

  get surveyResponses(): SurveyResponse[] {
    return this._surveyResponses;
  }

  set surveyResponses(value: SurveyResponse[]) {
    this._surveyResponses = value;
  }
}
