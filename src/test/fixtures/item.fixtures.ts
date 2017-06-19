import { USER_ID } from './user.fixtures';
import { Item } from '../../app/shared/item/item';
import {
  ItemActions,
  ItemBulkResponse,
  ItemCounters,
  ItemFlags,
  ItemResponse,
  ItemSaleConditions,
  LatestItemResponse
} from '../../app/shared/item/item-response.interface';
import { Image, Location } from '../../app/shared/user/user-response.interface';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';

export const ITEM_ID: string = '9jd7ryx5odjk';
export const ITEM_LEGACY_ID: number = 500002512;
export const ITEM_TITLE: string = 'The title';
export const ITEM_TITLE2: string = 'The title2';
export const ITEM_DESCRIPTION: string = 'The description';
export const ITEM_DESCRIPTION2: string = 'The description2';
export const ITEM_CATEGORY_ID: number = 12545;

export const ITEM_LOCATION: Location = {
  'id': 101,
  'approximated_latitude': 41.399132621722174,
  'approximated_longitude': 2.17585484411869,
  'city': 'Barcelona',
  'zip': '08009',
  'approxRadius': 0
};

export const ITEM_SALE_PRICE: number = 123.45;
export const ITEM_SALE_PRICE2: number = 1230;
export const ITEM_CURRENCY_CODE: string = 'EUR';
export const ITEM_MODIFIED_DATE: number = 1474554861894;
export const ITEM_URL: string = 'http://dock9.wallapop.com/i/500002512?_pid=wi&_uid=500002512';
export const ITEM_WEB_SLUG: string = 'webslug-9jd7ryx5odjk';
export const ITEM_PUBLISHED_DATE: number = 1473784861894;
export const ITEM_PUBLISHED_DATE2: number = 1473784861898;

export const ITEM_FLAGS: ItemFlags = {
  'pending': false,
  'sold': false,
  'favorite': false,
  'reserved': false,
  'removed': false,
  'banned': false,
  'expired': false,
  'review_done': false,
  'bumped': false,
  'highlighted': false
};

export const ITEM_ACTIONS_ALLOWED: ItemActions = {
  'chat': true,
  'share': true,
  'check_profile': true,
  'report': true,
  'favorite': true,
  'visible': true,
  'edit': false,
  'reserve': false,
  'sell': false,
  'delete': false
};

export const ITEM_SALE_CONDITIONS: ItemSaleConditions = {
  'fix_price': false,
  'exchange_allowed': false,
  'shipping_allowed': false
};

export const ITEM_MAIN_IMAGE: Image = {
  'id': '4z4vl5ygwvzy',
  'legacy_id': 500002514,
  'original_width': 100,
  'original_height': 62,
  'average_hex_color': '6a707b',
  'urls_by_size': {
    'original': 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002514&pictureSize=ORIGINAL',
    'small': 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002514&pictureSize=W320',
    'large': 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002514&pictureSize=W320',
    'medium': 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002514&pictureSize=W320',
    'xlarge': 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002514&pictureSize=W320'
  }
};

export const ITEM_IMAGES: Image[] = [{
  'id': '4z4vl5ygwvzy',
  'legacy_id': 500002514,
  'original_width': 100,
  'original_height': 62,
  'average_hex_color': '6a707b',
  'urls_by_size': {
    'original': 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002514&pictureSize=ORIGINAL',
    'small': 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002514&pictureSize=W320',
    'large': 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002514&pictureSize=W320',
    'medium': 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002514&pictureSize=W320',
    'xlarge': 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002514&pictureSize=W320'
  }
}
];

export const ITEM_DATA: ItemResponse = {
  'id': ITEM_ID,
  'legacy_id': ITEM_LEGACY_ID,
  'title': ITEM_TITLE,
  'description': ITEM_DESCRIPTION,
  'owner': USER_ID,
  'category_id': ITEM_CATEGORY_ID,
  'location': ITEM_LOCATION,
  'sale_price': ITEM_SALE_PRICE,
  'currency_code': ITEM_CURRENCY_CODE,
  'modified_date': ITEM_MODIFIED_DATE,
  'url': ITEM_URL,
  'flags': ITEM_FLAGS,
  'actions_allowed': ITEM_ACTIONS_ALLOWED,
  'sale_conditions': ITEM_SALE_CONDITIONS,
  'main_image': ITEM_MAIN_IMAGE,
  'images': ITEM_IMAGES,
  'web_slug': ITEM_WEB_SLUG,
  'published_date': ITEM_PUBLISHED_DATE
};

export const ITEM_DATA2: ItemResponse = {
  'id': ITEM_ID,
  'legacy_id': 500002512,
  'title': ITEM_TITLE2,
  'description': ITEM_DESCRIPTION2,
  'owner': USER_ID,
  'category_id': ITEM_CATEGORY_ID,
  'location': ITEM_LOCATION,
  'sale_price': ITEM_SALE_PRICE2,
  'currency_code': ITEM_CURRENCY_CODE,
  'modified_date': ITEM_MODIFIED_DATE,
  'url': ITEM_URL,
  'flags': ITEM_FLAGS,
  'actions_allowed': ITEM_ACTIONS_ALLOWED,
  'sale_conditions': ITEM_SALE_CONDITIONS,
  'main_image': ITEM_MAIN_IMAGE,
  'images': ITEM_IMAGES,
  'web_slug': ITEM_WEB_SLUG,
  'published_date': ITEM_PUBLISHED_DATE2
};

export const ITEM_VIEWS: number = 123;
export const ITEM_FAVORITES: number = 456;

export const ITEM_COUNTERS_DATA: ItemCounters = {
  'views': ITEM_VIEWS,
  'favorites': ITEM_FAVORITES
};

export const LATEST_ITEM_COUNT: number = 3;

export const LATEST_ITEM_DATA: LatestItemResponse = {
  count: LATEST_ITEM_COUNT,
  items: [ITEM_DATA]
};

export const LATEST_ITEM_DATA_EMPTY: LatestItemResponse = {
  count: LATEST_ITEM_COUNT,
  items: []
};

export const MOCK_ITEM: Item = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  ITEM_DATA.description,
  ITEM_DATA.category_id,
  ITEM_DATA.location,
  ITEM_DATA.sale_price,
  ITEM_DATA.currency_code,
  ITEM_DATA.modified_date,
  ITEM_DATA.url,
  ITEM_DATA.flags,
  ITEM_DATA.actions_allowed,
  ITEM_DATA.sale_conditions,
  ITEM_DATA.main_image,
  ITEM_DATA.images,
  ITEM_DATA.web_slug,
  ITEM_DATA.published_date
);

export function getMockItem(id: string, legacyId: number) {
  let item: Item = _.clone(MOCK_ITEM);
  item.id = id;
  item.legacyId = legacyId;
  return item;
}

export function createItemsArray(total: number, starting: number = 1) {
  let items: Item[] = [];
  for (let i: number = starting; i < total + starting; i++) {
    items.push(getMockItem(i.toString(), i));
  }
  return items;
}

export const ITEMS_BULK_UPDATED_IDS: string[] = ['1', '3', '5'];
export const ITEMS_BULK_FAILED_IDS: string[] = ['2', '4'];
export const ITEMS_BULK_RESPONSE: ItemBulkResponse = {
  updatedIds: ITEMS_BULK_UPDATED_IDS,
  failedIds: []
};
export const ITEMS_BULK_RESPONSE_FAILED: ItemBulkResponse = {
  updatedIds: ITEMS_BULK_UPDATED_IDS,
  failedIds: ITEMS_BULK_FAILED_IDS
};


export class MockedItemService {
  public get(url: string): Observable<Item> {
    let data: any = ITEM_DATA;
    return Observable.of(new Item(
      data.id,
      data.legacyId,
      data.owner,
      data.title,
      data.description,
      data.categoryId,
      data.location,
      data.salePrice,
      data.currencyCode,
      data.modifiedDate,
      data.url,
      data.flags,
      data.actionsAllowed,
      data.saleConditions,
      data.mainImage,
      data.images
    ));
  }
}
