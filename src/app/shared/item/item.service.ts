import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Item, FAKE_ITEM_IMAGE_BASE_PATH, ITEM_STATUSES } from './item';
import { ResourceService } from '../resource/resource.service';
import {
  ItemCounters, ItemResponse, LatestItemResponse, ItemDataResponse,
  ItemBulkResponse, ItemsStore
} from './item-response.interface';
import { Response } from '@angular/http';
import * as _ from 'lodash';
import { I18nService } from '../i18n/i18n.service';
import { BanReason } from './ban-reason.interface';
import { USER_ID } from '../../../test/fixtures/user.fixtures';
import { TrackingService } from '../tracking/tracking.service';
import { EventService } from '../event/event.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';

@Injectable()
export class ItemService extends ResourceService {

  private API_URL_V1: string = 'shnm-portlet/api/v1';
  protected API_URL_V2: string = 'api/v2/items';
  protected API_URL_V3: string = 'api/v3/items';
  private banReasons: BanReason[] = null;
  private items: ItemsStore = {
    active: [],
    sold:   []
  };
  public selectedItems: string[] = [];

  constructor(http: HttpService,
              private i18n: I18nService,
              private trackingService: TrackingService,
              private eventService: EventService) {
    super(http);
  }

  public get(id: string): Observable<Item> {
    return super.get(id).catch(() => {
      return Observable.of(this.getFakeItem(id));
    });
  }

  public getFakeItem(id: string): Item {
    let fakeItem: Item = new Item(id, 1, USER_ID, 'No disponible');
    fakeItem.setFakeImage(FAKE_ITEM_IMAGE_BASE_PATH);
    return fakeItem;
  }

  public getCounters(id: string): Observable<ItemCounters> {
    return this.http.get(this.API_URL_V2 + '/' + id + '/counters')
        .map((r: Response) => r.json())
        .catch(() => Observable.of({views: 0, favorites: 0}));
  }

  public getLatest(userId: string): Observable<ItemDataResponse> {
    return this.http.get(this.API_URL_V2 + '/latest', {userId: userId})
        .map((r: Response) => r.json())
        .map((resp: LatestItemResponse) => {
          return {
            count: resp.count - 1,
            data:  resp.items[0] ? this.mapRecordData(resp.items[0]) : null
          };
        });
  }

  public mines(pageNumber: number, pageSize: number, sortBy: string, status: string = 'active', term?: string, cache: boolean = true): Observable<Item[]> {
    let init: number = (pageNumber - 1) * pageSize;
    let end: number = init + pageSize;
    let observable: Observable<Item[]>;
    if (this.items[status].length && cache) {
      observable = Observable.of(this.items[status]);
    } else {
      observable = this.recursiveMines(0, 300, status)
          .map((res: ItemResponse[]) => {
            if (res.length > 0) {
              let items: Item[] = res.map((item: ItemResponse) => this.mapRecordData(item));
              this.items[status] = items;
              return items;
            }
            return [];
          });
    }
    return observable
        .map((res: Item[]) => {
          term = term ? term.trim().toLowerCase() : '';
          if (term !== '') {
            return _.filter(res, (item: Item) => {
              return item.title.toLowerCase().indexOf(term) !== -1 || item.description.toLowerCase().indexOf(term) !== -1;
            });
          }
          return res;
        })
        .map((res: Item[]) => {
          let sort: string[] = sortBy.split('_');
          let field: string = sort[0] === 'price' ? 'salePrice' : 'publishedDate';
          let sorted: Item[] = _.sortBy(res, [field]);
          if (sort[1] === 'desc') {
            return _.reverse(sorted);
          }
          return sorted;
        })
        .map((res: Item[]) => {
          return res.slice(init, end);
        });
  }

  public setSold(id: number): Observable<any> {
    return this.http.post(this.API_URL_V1 + '/item.json/' + id + '/sold')
        .do(() => {
          let index: number = _.findIndex(this.items.active, {'legacyId': id});
          let deletedItem: Item = this.items.active.splice(index, 1)[0];
          if (this.items.sold.length) {
            this.items.sold.push(deletedItem);
          }
          this.eventService.emit(EventService.ITEM_SOLD, deletedItem);
        });
  }

  public delete(id: number): Observable<any> {
    return this.http.delete(this.API_URL_V1 + '/item.json/' + id)
        .do(() => {
          let index: number = _.findIndex(this.items.active, {'legacyId': id});
          if (index > -1) {
            this.items.active.splice(index, 1);
          } else {
            index = _.findIndex(this.items.sold, {'legacyId': id});
            this.items.sold.splice(index, 1);
          }
        });
  }

  public bulkDelete(type: string): Observable<ItemBulkResponse> {
    return this.http.put(this.API_URL_V3 + '/delete', {
      ids: this.selectedItems
    })
        .map((r: Response) => r.json())
        .do((response: ItemBulkResponse) => {
          response.updatedIds.forEach((id: string) => {
            let index: number = _.findIndex(this.items[type], {'id': id});
            this.items[type].splice(index, 1);
          });
          this.deselectItems();
        });
  }

  public bulkReserve(): Observable<ItemBulkResponse> {
    return this.http.put(this.API_URL_V3 + '/reserve', {
      ids: this.selectedItems
    })
        .map((r: Response) => r.json())
        .do((response: ItemBulkResponse) => {
          response.updatedIds.forEach((id: string) => {
            let index: number = _.findIndex(this.items.active, {'id': id});
            this.items.active[index].reserved = true;
          });
          this.deselectItems();
        });
  }

  public bulkSetSold(): Observable<ItemBulkResponse> {
    return this.http.put(this.API_URL_V3 + '/sold', {
      ids: this.selectedItems
    })
        .map((r: Response) => r.json())
        .do((response: ItemBulkResponse) => {
          response.updatedIds.forEach((id: string) => {
            let index: number = _.findIndex(this.items.active, {'id': id});
            let deletedItem: Item = this.items.active.splice(index, 1)[0];
            deletedItem.sold = true;
            deletedItem.selected = false;
            if (this.items.sold.length) {
              this.items.sold.push(deletedItem);
            }
          });
          this.deselectItems();
          this.eventService.emit(EventService.ITEM_SOLD, response.updatedIds);
        });
  }

  public reserve(id: number): Observable<any> {
    return this.http.post(this.API_URL_V1 + '/item.json/' + id + '/reserve2');
  }

  public unreserve(id: number): Observable<any> {
    return this.http.delete(this.API_URL_V1 + '/item.json/' + id + '/reserve2');
  }

  public deselectItems() {
    this.trackingService.track(TrackingService.PRODUCT_LIST_BULK_UNSELECTED, {product_ids: this.selectedItems.join(', ')});
    this.selectedItems = [];
    this.items.active.map((item: Item) => {
      item.selected = false;
    });
    this.items.sold.map((item: Item) => {
      item.selected = false;
    });
  }

  public resetCache() {
    this.items = {
      active: [],
      sold:   []
    };
  }

  private recursiveMines(init: number, offset: number, status?: string): Observable<ItemResponse[]> {
    return this.http.get(this.API_URL_V2 + '/mines2', {
      statuses: ITEM_STATUSES[status],
      init:     init,
      end:      init + offset
    })
        .map((r: Response) => r.json())
        .flatMap((res: ItemResponse[]) => {
          if (res.length > 0) {
            return this.recursiveMines(init + offset, offset, status)
                .map((res2: ItemResponse[]) => {
                  return res.concat(res2);
                });
          } else {
            return Observable.of([]);
          }
        });
  }

  public getBanReasons(): Observable<BanReason[]> {
    if (!this.banReasons) {
      this.banReasons = this.i18n.getTranslations('reportListingReasons');
    }
    return Observable.of(this.banReasons);
  }

  public reportListing(itemId: number,
                       comments: string,
                       reason: number,
                       conversationId: number): Observable<any> {

    let data: any = {
      itemId:         itemId,
      comments:       comments,
      reason:         reason,
      conversationId: conversationId
    };
    return this.http.post(this.API_URL_V1 + '/item.json/report2', data);
  }

  public getSelectedItems(): Item[] {
    return this.selectedItems.map((id: string) => {
      return <Item>_.find(this.items.active, {id: id});
    });
  }

  public getItemAndSetBumpExpiringDate(id: string, date: number): Item {
    const index: number = _.findIndex(this.items.active, {id: id});
    if (index !== -1) {
      this.items.active[index].bumpExpiringDate = date;
      return this.items.active[index];
    }
    return;
  }

  protected mapRecordData(data: ItemResponse): Item {
    return new Item(
        data.id,
        data.legacy_id,
        data.owner,
        data.title,
        data.description,
        data.category_id,
        data.location,
        data.sale_price,
        data.currency_code,
        data.modified_date,
        data.url,
        data.flags,
        data.actions_allowed,
        data.sale_conditions,
        data.main_image,
        data.images,
        data.web_slug,
        data.published_date
    );
  }
}


