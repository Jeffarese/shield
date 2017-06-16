import { Model } from '../resource/model.interface';
import { User } from '../user/user';

export class Message implements Model {
  private _user: User;
  private _fromBuyer: boolean;
  constructor(private _id: string,
              private _conversationId: string,
              private _message: string,
              private _from: string,
              private _date?: Date,
              private _read?: boolean) {
  }

  get id(): string {
    return this._id;
  }

  get message(): string {
    return this._message;
  }

  get conversationId(): string {
    return this._conversationId;
  }

  get date(): Date {
    return this._date;
  }

  set date(value: Date) {
    this._date = value;
  }

  get read(): boolean {
    return this._read;
  }

  set read(value: boolean) {
    this._read = value;
  }

  get from(): string {
    return this._from;
  }

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  get fromBuyer(): boolean {
    return this._fromBuyer;
  }

  set fromBuyer(value: boolean) {
    this._fromBuyer = value;
  }
}
