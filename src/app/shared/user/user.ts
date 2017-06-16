import { Model } from '../resource/model.interface';
import { Location, UserStats, UserValidations } from './user-response.interface';
import { Item } from '../item/item';

export const USER_BASE_PATH: string = 'http://es.wallapop.com/user/';
export const PLACEHOLDER_AVATAR: string = '/assets/images/user.png';

export class User implements Model {

  private _itemDistance: number;
  private _webLink: string;
  private _sellingItem: Item;
  private _itemsCount: number;

  constructor(private _id: string,
              private _microName?: string,
              private _image?: any,
              private _location?: Location,
              private _stats?: UserStats,
              private _validations?: UserValidations,
              private _verificationLevel?: number,
              private _scoringStars?: number,
              private _scoringStarts?: number,
              private _responseRate?: string,
              private _online?: boolean,
              private _type?: string,
              private _receivedReports?: number,
              webSlug?: string) {

    this._webLink = webSlug ? USER_BASE_PATH + webSlug : null;
    this._type = this.mapType(this._type);
  }

  get id(): string {
    return this._id;
  }

  get microName(): string {
    return this._microName;
  }

  get image(): any {
    return this._image;
  }

  get location(): Location {
    return this._location;
  }

  get stats(): UserStats {
    return this._stats;
  }

  get validations(): UserValidations {
    return this._validations;
  }

  get verificationLevel(): number {
    return this._verificationLevel;
  }

  get scoringStars(): number {
    return this._scoringStars;
  }

  get scoringStarts(): number {
    return this._scoringStarts;
  }

  get responseRate(): string {
    return this._responseRate;
  }

  get online(): boolean {
    return this._online;
  }

  get type(): string {
    return this._type;
  }

  get receivedReports(): number {
    return this._receivedReports;
  }

  get itemDistance(): number {
    return this._itemDistance;
  }

  set itemDistance(value: number) {
    this._itemDistance = value;
  }

  get webLink(): string {
    return this._webLink;
  }

  set online(value: boolean) {
    this._online = value;
  }

  private mapType(type: string) {
    return type ? type : 'inactive';
  }

  get sellingItem(): Item {
    return this._sellingItem;
  }

  set sellingItem(value: Item) {
    this._sellingItem = value;
  }

  get itemsCount(): number {
    return this._itemsCount;
  }

  set itemsCount(value: number) {
    this._itemsCount = value;
  }
}
