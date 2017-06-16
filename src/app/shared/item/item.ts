import { Model } from '../resource/model.interface';
import { Image, Location } from '../user/user-response.interface';
import { ItemFlags, ItemActions, ItemSaleConditions } from './item-response.interface';

export const ITEM_BASE_PATH: string = 'http://es.wallapop.com/item/';
export const FAKE_ITEM_IMAGE_BASE_PATH: string = '../../../assets/images/fake-item.png';
export const FAKE_ITEM_IMAGE_SMALL_BASE_PATH: string = '../../../assets/images/fake-item-s.png';
export const FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH: string = '../../../assets/images/fake-item-s-l.png';
export const ITEM_STATUSES: any = {
  'active': 'PUBLISHED',
  'sold': ['SOLD_OUTSIDE', 'BOUGHT']
};

export class Item implements Model {

  private _webLink: string;
  private _views: number;
  private _favorites: number;
  private _selected: boolean = false;
  private _bumpExpiringDate: number;

  constructor(private _id: string,
              private _legacyId: number,
              private _owner: string,
              private _title?: string,
              private _description?: string,
              private _categoryId?: number,
              private _location?: Location,
              private _salePrice?: number,
              private _currencyCode?: string,
              private _modifiedDate?: number,
              private _url?: string,
              private _flags?: ItemFlags,
              private _actionsAllowed?: ItemActions,
              private _saleConditions?: ItemSaleConditions,
              private _mainImage?: Image,
              private _images?: Image[],
              private webSlug?: string,
              private _publishedDate?: number) {
    this._webLink = ITEM_BASE_PATH + webSlug;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get legacyId(): number {
    return this._legacyId;
  }

  set legacyId(value: number) {
    this._legacyId = value;
  }

  get owner(): string {
    return this._owner;
  }

  set owner(value: string) {
    this._owner = value;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get categoryId(): number {
    return this._categoryId;
  }

  get location(): Location {
    return this._location;
  }

  get salePrice(): number {
    return this._salePrice;
  }

  get currencyCode(): string {
    return this._currencyCode;
  }

  get modifiedDate(): number {
    return this._modifiedDate;
  }

  get url(): string {
    return this._url;
  }

  get flags(): ItemFlags {
    return this._flags;
  }

  get actionsAllowed(): ItemActions {
    return this._actionsAllowed;
  }

  get saleConditions(): ItemSaleConditions {
    return this._saleConditions;
  }

  get mainImage(): Image {
    return this._mainImage;
  }

  get images(): Image[] {
    return this._images;
  }

  get webLink(): string {
    return this._webLink;
  }

  get views(): number {
    return this._views;
  }

  set views(value: number) {
    this._views = value;
  }

  get favorites(): number {
    return this._favorites;
  }

  set favorites(value: number) {
    this._favorites = value;
  }

  get publishedDate(): number {
    return this._publishedDate;
  }

  public setFakeImage(image: string) {
    this._mainImage = {
      id: '',
      legacy_id: 0,
      original_width: 0,
      original_height: 0,
      average_hex_color: '',
      urls_by_size: {
        original: '',
        small: '',
        medium: '',
        large: '',
        xlarge: ''
      }
    };
  }

  set sold(value: boolean) {
    this._flags.sold = value;
  }

  get sold(): boolean {
    return this._flags ? this._flags.sold : false;
  }

  set reserved(value: boolean) {
    this._flags.reserved = value;
  }

  get reserved(): boolean {
    return this._flags ? this._flags.reserved : false;
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
  }

  get bumpExpiringDate(): number {
    return this._bumpExpiringDate;
  }

  set bumpExpiringDate(value: number) {
    this._bumpExpiringDate = value;
  }

}
