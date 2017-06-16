import { ApiResponse } from '../resource/api-response.interface';
import { Image, Location } from '../user/user-response.interface';
import { Item } from './item';

export interface ItemResponse extends ApiResponse {
  title: string;
  description: string;
  owner: string;
  category_id: number;
  location: Location;
  sale_price: number;
  currency_code: string;
  modified_date: number;
  url: string;
  flags: ItemFlags;
  actions_allowed: ItemActions;
  sale_conditions: ItemSaleConditions;
  main_image: Image;
  images: Image[];
  web_slug: string;
  published_date: number;
}

export interface ItemFlags {
  pending: boolean;
  sold: boolean;
  favorite: boolean;
  reserved: boolean;
  removed: boolean;
  banned: boolean;
  expired: boolean;
  review_done: boolean;
  bumped: boolean;
  highlighted: boolean;
}

export interface ItemActions {
  chat: boolean;
  share: boolean;
  check_profile: boolean;
  report: boolean;
  favorite: boolean;
  visible: boolean;
  edit: boolean;
  reserve: boolean;
  sell: boolean;
  delete: boolean;
}

export interface ItemSaleConditions {
  fix_price: boolean;
  exchange_allowed: boolean;
  shipping_allowed: boolean;
}

export interface ItemCounters {
  views: number;
  favorites: number;
}

export interface LatestItemResponse {
  count: number;
  items: ItemResponse[];
}

export interface ItemDataResponse {
  count: number;
  data: Item;
}

export interface ItemBulkResponse {
  updatedIds: string[];
  failedIds: string[];
}

export interface ItemsStore {
  active: Item[];
  sold: Item[];
}
