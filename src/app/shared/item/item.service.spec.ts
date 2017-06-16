/* tslint:disable:no-unused-variable */

import { fakeAsync, TestBed } from '@angular/core/testing';
import { ItemService } from './item.service';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { RequestMethod, Response, ResponseOptions } from '@angular/http';
import { environment } from '../../../environments/environment';
import {
  createItemsArray,
  ITEM_ACTIONS_ALLOWED,
  ITEM_CATEGORY_ID,
  ITEM_COUNTERS_DATA,
  ITEM_CURRENCY_CODE,
  ITEM_DATA,
  ITEM_DATA2,
  ITEM_DESCRIPTION,
  ITEM_FAVORITES,
  ITEM_FLAGS,
  ITEM_ID,
  ITEM_IMAGES,
  ITEM_LOCATION,
  ITEM_MAIN_IMAGE,
  ITEM_MODIFIED_DATE,
  ITEM_PUBLISHED_DATE,
  ITEM_PUBLISHED_DATE2,
  ITEM_SALE_CONDITIONS,
  ITEM_SALE_PRICE,
  ITEM_SALE_PRICE2,
  ITEM_TITLE,
  ITEM_URL,
  ITEM_VIEWS,
  ITEMS_BULK_FAILED_IDS,
  ITEMS_BULK_RESPONSE,
  ITEMS_BULK_RESPONSE_FAILED,
  ITEMS_BULK_UPDATED_IDS,
  LATEST_ITEM_COUNT,
  LATEST_ITEM_DATA,
  LATEST_ITEM_DATA_EMPTY
} from '../../../test/fixtures/item.fixtures';
import { Item } from './item';
import { TEST_HTTP_PROVIDERS } from '../../../test/utils';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { ItemBulkResponse, ItemCounters, ItemDataResponse } from './item-response.interface';
import { USER_ID } from '../../../test/fixtures/user.fixtures';
import { HttpService } from '../http/http.service';
import { I18nService } from '../i18n/i18n.service';
import { TrackingService } from '../tracking/tracking.service';
import { MockTrackingService } from '../../../test/fixtures/tracking.fixtures';
import { EventService } from '../event/event.service';

describe('Service: Item', () => {

  const FAKE_ITEM_TITLE: string = 'No disponible';
  let service: ItemService;
  let mockBackend: MockBackend;
  let http: HttpService;
  let trackingService: TrackingService;
  let eventService: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventService,
        {provide: TrackingService, useClass: MockTrackingService},
        ...TEST_HTTP_PROVIDERS,
        ItemService,
        I18nService
      ]
    });
    service = TestBed.get(ItemService);
    mockBackend = TestBed.get(MockBackend);
    http = TestBed.get(HttpService);
    trackingService = TestBed.get(TrackingService);
    eventService = TestBed.get(EventService);
  });

  describe('get', () => {
    describe('without backend errors', () => {
      beforeEach(fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          let body: any;
          switch (connection.request.url) {
            case environment['baseUrl'] + 'api/v2/items/' + ITEM_ID:
              body = ITEM_DATA;
              break;
            case environment['baseUrl'] + 'api/v2/items/' + ITEM_ID + '/counters':
              body = ITEM_COUNTERS_DATA;
              break;
          }
          connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(body)})));
        });
      }));

      it('should return the Item object', fakeAsync(() => {
        let item: Item;
        service.get(ITEM_ID).subscribe((r: Item) => {
          item = r;
        });
        expect(item.id).toBe(ITEM_ID);
        expect(item.title).toBe(ITEM_TITLE);
        expect(item.description).toBe(ITEM_DESCRIPTION);
        expect(item.categoryId).toBe(ITEM_CATEGORY_ID);
        expect(item.location).toEqual(ITEM_LOCATION);
        expect(item.salePrice).toBe(ITEM_SALE_PRICE);
        expect(item.currencyCode).toBe(ITEM_CURRENCY_CODE);
        expect(item.modifiedDate).toBe(ITEM_MODIFIED_DATE);
        expect(item.url).toBe(ITEM_URL);
        expect(item.flags).toEqual(ITEM_FLAGS);
        expect(item.actionsAllowed).toEqual(ITEM_ACTIONS_ALLOWED);
        expect(item.saleConditions).toEqual(ITEM_SALE_CONDITIONS);
        expect(item.mainImage).toEqual(ITEM_MAIN_IMAGE);
        expect(item.images).toEqual(ITEM_IMAGES);
      }));

    });
    describe('with backend errors', () => {
      it('should return an observable with a fake item', () => {
        let observableResponse: Item;
        spyOn(service, 'getCounters').and.returnValue(Observable.of({}));
        mockBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockError();
        });
        service.get(ITEM_ID).subscribe((r: Item) => {
          observableResponse = r;
        });
        expect(observableResponse.id).toBe(ITEM_ID);
        expect(observableResponse.title).toBe(FAKE_ITEM_TITLE);
      });
    });

  });
  describe('getCounters', () => {

    describe('with no error', () => {
      it('should return the counters', () => {
        let observableResponse: any;
        mockBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(ITEM_COUNTERS_DATA)})));
        });
        service.getCounters(ITEM_ID).subscribe((r: ItemCounters) => {
          observableResponse = r;
        });
        expect(observableResponse.views).toBe(ITEM_VIEWS);
        expect(observableResponse.favorites).toBe(ITEM_FAVORITES);
      });
    });

    describe('receiving an error from the server', () => {
      it('should return a fake counter object', () => {
        let observableResponse: ItemCounters;
        mockBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockError();
        });
        service.getCounters(ITEM_ID).subscribe((r: ItemCounters) => {
          observableResponse = r;
        });
        expect(observableResponse.views).toBe(0);
        expect(observableResponse.favorites).toBe(0);
      });
    });
  });

  describe('getFakeItem', () => {
    it('should return a fake item', () => {
      let item: Item = service.getFakeItem(ITEM_ID);
      expect(item.id).toBe(ITEM_ID);
      expect(item.title).toBe(FAKE_ITEM_TITLE);
      expect(item.mainImage.urls_by_size.small).toBe('');
      expect(item.mainImage.urls_by_size.medium).toBe('');
      expect(item.mainImage.urls_by_size.large).toBe('');
    });

  });

  describe('getLatest', () => {
    it('should return the latest item', () => {
      let observableResponse: ItemDataResponse;
      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(LATEST_ITEM_DATA)})));
      });
      service.getLatest(USER_ID).subscribe((r: ItemDataResponse) => {
        observableResponse = r;
      });
      expect(observableResponse.count).toBe(LATEST_ITEM_COUNT - 1);
      expect(observableResponse.data).toEqual(new Item(
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
      ));
    });
    it('should return null item', () => {
      let observableResponse: ItemDataResponse;
      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(LATEST_ITEM_DATA_EMPTY)})));
      });
      service.getLatest(USER_ID).subscribe((r: ItemDataResponse) => {
        observableResponse = r;
      });
      expect(observableResponse.count).toBe(LATEST_ITEM_COUNT - 1);
      expect(observableResponse.data).toEqual(null);
    });
  });

  describe('mines', () => {
    describe('with data', () => {
      beforeEach(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          if (connection.request.url.indexOf('init=0&end=300') !== -1) {
            connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify([ITEM_DATA, ITEM_DATA2])})));
          } else if (connection.request.url.indexOf('init=300&end=600') !== -1) {
            connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify([ITEM_DATA, ITEM_DATA2])})));
          } else {
            connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify([])})));
          }
          expect(connection.request.url).toContain('/mines2');
        });
        spyOn(http, 'get').and.callThrough();
      });
      it('should return 3 pages recursively', () => {
        let observableResponse: Item[];
        service.mines(1, 10, 'date_desc').subscribe((r: Item[]) => {
          observableResponse = r;
        });
        expect(observableResponse.length).toBe(4);
      });
      it('should return cached results the second time', () => {
        let observableResponse: Item[];
        let observableResponse2: Item[];
        service.mines(1, 10, 'date_desc').subscribe((r: Item[]) => {
          observableResponse = r;
        });
        expect(http.get).toHaveBeenCalledTimes(3);
        http.get['calls'].reset();
        service.mines(1, 10, 'date_desc').subscribe((r: Item[]) => {
          observableResponse2 = r;
        });
        expect(http.get).toHaveBeenCalledTimes(0);
        expect(observableResponse).toEqual(observableResponse2);
      });
      it('should NOT return cached results the second time', () => {
        service.mines(1, 10, 'date_desc').subscribe();
        expect(http.get).toHaveBeenCalledTimes(3);
        http.get['calls'].reset();
        service.mines(1, 10, 'date_desc', undefined, undefined, false).subscribe();
        expect(http.get).toHaveBeenCalledTimes(3);
      });
      it('should filter by term', () => {
        let observableResponse: Item[];
        service.mines(1, 10, 'date_desc', undefined, 'title').subscribe((r: Item[]) => {
          observableResponse = r;
        });
        expect(observableResponse.length).toBe(4);
        observableResponse = undefined;
        service.mines(1, 10, 'date_desc', undefined, 'TITLE').subscribe((r: Item[]) => {
          observableResponse = r;
        });
        expect(observableResponse.length).toBe(4);
        observableResponse = undefined;
        service.mines(1, 10, 'date_desc', undefined, 'title2').subscribe((r: Item[]) => {
          observableResponse = r;
        });
        expect(observableResponse.length).toBe(2);
        observableResponse = undefined;
        service.mines(1, 10, 'date_desc', undefined, 'test').subscribe((r: Item[]) => {
          observableResponse = r;
        });
        expect(observableResponse.length).toBe(0);
        observableResponse = undefined;
        service.mines(1, 10, 'date_desc', undefined, 'description').subscribe((r: Item[]) => {
          observableResponse = r;
        });
        expect(observableResponse.length).toBe(4);
        observableResponse = undefined;
        service.mines(1, 10, 'date_desc', undefined, 'description2').subscribe((r: Item[]) => {
          observableResponse = r;
        });
        expect(observableResponse.length).toBe(2);
      });
      it('should sort by date', () => {
        let observableResponse: Item[];
        service.mines(1, 10, 'date_desc').subscribe((r: Item[]) => {
          observableResponse = r;
        });
        expect(observableResponse[0].publishedDate).toBe(ITEM_PUBLISHED_DATE2);
        expect(observableResponse[1].publishedDate).toBe(ITEM_PUBLISHED_DATE2);
        expect(observableResponse[2].publishedDate).toBe(ITEM_PUBLISHED_DATE);
        expect(observableResponse[3].publishedDate).toBe(ITEM_PUBLISHED_DATE);
        observableResponse = undefined;
        service.mines(1, 10, 'date_asc').subscribe((r: Item[]) => {
          observableResponse = r;
        });
        expect(observableResponse[0].publishedDate).toBe(ITEM_PUBLISHED_DATE);
        expect(observableResponse[1].publishedDate).toBe(ITEM_PUBLISHED_DATE);
        expect(observableResponse[2].publishedDate).toBe(ITEM_PUBLISHED_DATE2);
        expect(observableResponse[3].publishedDate).toBe(ITEM_PUBLISHED_DATE2);
        observableResponse = undefined;
        service.mines(1, 10, 'price_asc').subscribe((r: Item[]) => {
          observableResponse = r;
        });
        expect(observableResponse[0].salePrice).toBe(ITEM_SALE_PRICE);
        expect(observableResponse[1].salePrice).toBe(ITEM_SALE_PRICE);
        expect(observableResponse[2].salePrice).toBe(ITEM_SALE_PRICE2);
        expect(observableResponse[3].salePrice).toBe(ITEM_SALE_PRICE2);
        observableResponse = undefined;
        service.mines(1, 10, 'price_desc').subscribe((r: Item[]) => {
          observableResponse = r;
        });
        expect(observableResponse[0].salePrice).toBe(ITEM_SALE_PRICE2);
        expect(observableResponse[1].salePrice).toBe(ITEM_SALE_PRICE2);
        expect(observableResponse[2].salePrice).toBe(ITEM_SALE_PRICE);
        expect(observableResponse[3].salePrice).toBe(ITEM_SALE_PRICE);
      });
      it('should paginate', () => {
        let observableResponse: Item[];
        service.mines(1, 2, 'date_desc').subscribe((r: Item[]) => {
          observableResponse = r;
        });
        expect(observableResponse[0].salePrice).toBe(ITEM_SALE_PRICE2);
        expect(observableResponse[1].salePrice).toBe(ITEM_SALE_PRICE2);
        observableResponse = undefined;
        service.mines(2, 2, 'date_desc').subscribe((r: Item[]) => {
          observableResponse = r;
        });
        expect(observableResponse[0].salePrice).toBe(ITEM_SALE_PRICE);
        expect(observableResponse[1].salePrice).toBe(ITEM_SALE_PRICE);
        observableResponse = undefined;
        service.mines(1, 4, 'date_desc').subscribe((r: Item[]) => {
          observableResponse = r;
        });
        expect(observableResponse.length).toBe(4);
      });
    });
    it('should return an empty array', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify([])})));
        expect(connection.request.url).toContain('/mines2');
      });
      let observableResponse: Item[];
      service.mines(1, 2, 'date_desc').subscribe((r: Item[]) => {
        observableResponse = r;
      });
      expect(observableResponse.length).toBe(0);
    });
  });

  describe('setSold', () => {

    const ID: number = 1;
    const TOTAL: number = 5;
    let eventEmitted: boolean;

    beforeEach(fakeAsync(() => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url).toBe(environment['baseUrl'] + 'shnm-portlet/api/v1/item.json/' + ID + '/sold');
        connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify({})})));
      });
      service['items']['active'] = createItemsArray(TOTAL);
      eventService.subscribe(EventService.ITEM_SOLD, () => {
        eventEmitted = true;
      });
    }));

    describe('sold array with items', () => {
      beforeEach(fakeAsync(() => {
        service['items']['sold'] = createItemsArray(TOTAL, TOTAL);
        service.setSold(ID).subscribe();
      }));
      it('should remove item from active array', () => {
        expect(service['items']['active'].length).toBe(TOTAL - 1);
        expect(_.find(service['items']['active'], {'legacyId': ID})).toBeFalsy();
      });

      it('should add item to sold array', () => {
        expect(service['items']['sold'].length).toBe(TOTAL + 1);
        expect(_.find(service['items']['sold'], {'legacyId': ID})).toBeTruthy();
      });

      it('should emit event', () => {
        expect(eventEmitted).toBeTruthy();
      });
    });

    describe('sold array without items', () => {
      beforeEach(fakeAsync(() => {
        service.setSold(ID).subscribe();
      }));
      it('should NOT add item to sold array', () => {
        expect(service['items']['sold'].length).toBe(0);
      });
    });

  });

  describe('delete', () => {

    const ID: number = 1;
    const TOTAL: number = 5;

    beforeEach(fakeAsync(() => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url).toBe(environment['baseUrl'] + 'shnm-portlet/api/v1/item.json/' + ID);
        expect(connection.request.method).toBe(RequestMethod.Delete);
        connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify({})})));
      });
    }));

    describe('item from active array', () => {
      it('should remove item from active array', () => {
        service['items']['active'] = createItemsArray(TOTAL);
        service.delete(ID).subscribe();
        expect(service['items']['active'].length).toBe(TOTAL - 1);
        expect(_.find(service['items']['active'], {'legacyId': ID})).toBeFalsy();
      });
    });

    describe('item from sold array', () => {
      it('should remove item from sold array', () => {
        service['items']['sold'] = createItemsArray(TOTAL);
        service['items']['active'] = [];
        service.delete(ID).subscribe();
        expect(service['items']['sold'].length).toBe(TOTAL - 1);
        expect(_.find(service['items']['sold'], {'legacyId': ID})).toBeFalsy();
      });
    });

  });

  describe('bulk actions', () => {

    const TOTAL: number = 5;
    let response: ItemBulkResponse;

    describe('bulkDelete', () => {

      describe('success', () => {
        beforeEach(fakeAsync(() => {
          mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url).toBe(environment['baseUrl'] + 'api/v3/items/delete');
            expect(connection.request.method).toBe(RequestMethod.Put);
            connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(ITEMS_BULK_RESPONSE)})));
          });
          response = null;
          spyOn(service, 'deselectItems');
        }));
        describe('from active array', () => {
          beforeEach(() => {
            service['items']['active'] = createItemsArray(TOTAL);
            service.bulkDelete('active').subscribe((r: ItemBulkResponse) => {
              response = r;
            });
          });
          it('should remove items', () => {
            expect(service['items']['active'].length).toBe(TOTAL - 3);
            expect(service['items']['active']).not.toContain('1');
            expect(service['items']['active']).not.toContain('3');
            expect(service['items']['active']).not.toContain('5');
          });
          it('should return updated and failed ids list', () => {
            expect(response.updatedIds).toEqual(ITEMS_BULK_UPDATED_IDS);
            expect(response.failedIds).toEqual([]);
          });
          it('should call deselectItems', () => {
            expect(service.deselectItems).toHaveBeenCalled();
          });
        });
        describe('from sold array', () => {
          beforeEach(() => {
            service['items']['sold'] = createItemsArray(TOTAL);
            service.bulkDelete('sold').subscribe((r: ItemBulkResponse) => {
              response = r;
            });
          });
          it('should remove items', () => {
            expect(service['items']['sold'].length).toBe(TOTAL - 3);
            expect(service['items']['sold']).not.toContain('1');
            expect(service['items']['sold']).not.toContain('3');
            expect(service['items']['sold']).not.toContain('5');
          });
        });
      });
      describe('failed', () => {
        beforeEach(fakeAsync(() => {
          mockBackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(ITEMS_BULK_RESPONSE_FAILED)})));
          });
          response = null;
        }));
        it('should return updated items', () => {
          service.bulkDelete('active').subscribe((r: ItemBulkResponse) => {
            response = r;
          });
          expect(response.failedIds).toEqual(ITEMS_BULK_FAILED_IDS);
        });
      });
    });

    describe('bulkReserve', () => {

      beforeEach(() => {
        service['items']['active'] = createItemsArray(TOTAL);
      });

      describe('success', () => {
        beforeEach(fakeAsync(() => {
          mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url).toBe(environment['baseUrl'] + 'api/v3/items/reserve');
            expect(connection.request.method).toBe(RequestMethod.Put);
            connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(ITEMS_BULK_RESPONSE)})));
          });
          response = null;
          spyOn(service, 'deselectItems');
          service.bulkReserve().subscribe((r: ItemBulkResponse) => {
            response = r;
          });
        }));
        it('should set items as reserved', () => {
          expect(service['items']['active'][0].reserved).toBeTruthy();
          expect(service['items']['active'][2].reserved).toBeTruthy();
          expect(service['items']['active'][4].reserved).toBeTruthy();
        });
        it('should return updated and failed ids list', () => {
          expect(response.updatedIds).toEqual(ITEMS_BULK_UPDATED_IDS);
          expect(response.failedIds).toEqual([]);
        });
        it('should call deselectItems', () => {
          expect(service.deselectItems).toHaveBeenCalled();
        });
      });
      describe('failed', () => {
        beforeEach(fakeAsync(() => {
          mockBackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(ITEMS_BULK_RESPONSE_FAILED)})));
          });
          response = null;
        }));
        it('should return updated items', () => {
          service.bulkReserve().subscribe((r: ItemBulkResponse) => {
            response = r;
          });
          expect(response.failedIds).toEqual(ITEMS_BULK_FAILED_IDS);
        });
      });
    });

    describe('bulkSetSold', () => {

      let eventEmitted: boolean;

      beforeEach(() => {
        service['items']['active'] = createItemsArray(TOTAL);
      });

      describe('success', () => {
        beforeEach(fakeAsync(() => {
          mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url).toBe(environment['baseUrl'] + 'api/v3/items/sold');
            expect(connection.request.method).toBe(RequestMethod.Put);
            connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(ITEMS_BULK_RESPONSE)})));
          });
          response = null;
          spyOn(service, 'deselectItems');
          eventService.subscribe(EventService.ITEM_SOLD, () => {
            eventEmitted = true;
          });
        }));
        describe('with sold items empty', () => {
          beforeEach(() => {
            service.bulkSetSold().subscribe((r: ItemBulkResponse) => {
              response = r;
            });
          });
          it('should remove items', () => {
            expect(service['items']['active'].length).toBe(TOTAL - 3);
            expect(service['items']['active']).not.toContain('1');
            expect(service['items']['active']).not.toContain('3');
            expect(service['items']['active']).not.toContain('5');
          });
          it('should return updated and failed ids list', () => {
            expect(response.updatedIds).toEqual(ITEMS_BULK_UPDATED_IDS);
            expect(response.failedIds).toEqual([]);
          });
          it('should call deselectItems', () => {
            expect(service.deselectItems).toHaveBeenCalled();
          });
          it('should not push to sold', () => {
            expect(service['items']['sold'].length).toBe(0);
          });
          it('should emit event', () => {
            expect(eventEmitted).toBeTruthy();
          });
        });
        describe('with sold items', () => {
          beforeEach(() => {
            service['items']['sold'] = createItemsArray(TOTAL, TOTAL);
            service.bulkSetSold().subscribe((r: ItemBulkResponse) => {
              response = r;
            });
          });
          it('should add deleted items to sold array', () => {
            expect(service['items']['sold'].length).toBe(TOTAL + 3);
            expect(service['items']['sold'][TOTAL].sold).toBeTruthy();
            expect(service['items']['sold'][TOTAL].selected).toBeFalsy();
            expect(service['items']['sold'][TOTAL + 1].sold).toBeTruthy();
            expect(service['items']['sold'][TOTAL + 1].selected).toBeFalsy();
            expect(service['items']['sold'][TOTAL + 2].sold).toBeTruthy();
            expect(service['items']['sold'][TOTAL + 2].selected).toBeFalsy();
          });
        });
      });
      describe('failed', () => {
        beforeEach(fakeAsync(() => {
          mockBackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(ITEMS_BULK_RESPONSE_FAILED)})));
          });
          response = null;
        }));
        it('should return updated items', () => {
          service.bulkSetSold().subscribe((r: ItemBulkResponse) => {
            response = r;
          });
          expect(response.failedIds).toEqual(ITEMS_BULK_FAILED_IDS);
        });
      });
    });

  });

  describe('reserve', () => {

    const ID: number = 1;

    it('should call the reserve api', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url).toBe(environment['baseUrl'] + 'shnm-portlet/api/v1/item.json/' + ID + '/reserve2');
        expect(connection.request.method).toBe(RequestMethod.Post);
      });
      service.reserve(ID);
    });

  });

  describe('unreserve', () => {

    const ID: number = 1;

    it('should call the reserve api', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url).toBe(environment['baseUrl'] + 'shnm-portlet/api/v1/item.json/' + ID + '/reserve2');
        expect(connection.request.method).toBe(RequestMethod.Delete);
      });
      service.unreserve(ID);
    });

  });

  describe('deselectItems', () => {
    it('should reset selected items array', () => {
      service.selectedItems = ['1', '2', '3'];
      service.deselectItems();
      expect(service.selectedItems.length).toBe(0);
    });
    it('should set item.selected to false', () => {
      service['items']['active'] = createItemsArray(5);
      service['items']['active'][0].selected = true;
      service['items']['active'][4].selected = true;
      service.deselectItems();
      expect(service['items']['active'][0].selected).toBeFalsy();
      expect(service['items']['active'][4].selected).toBeFalsy();
    });
    it('should track the ProductListbulkUnselected', () => {
      spyOn(trackingService, 'track');
      service.selectedItems = ['1', '2', '3'];
      service.deselectItems();
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_LIST_BULK_UNSELECTED, {product_ids: '1, 2, 3'});
    });
  });

  describe('resetCache', () => {
    it('should reset items', () => {
      service['items']['active'] = createItemsArray(4);
      service['items']['sold'] = createItemsArray(4);
      service.resetCache();
      expect(service['items']).toEqual({
        active: [],
        sold: []
      });
    });
  });

  describe('getSelectedItems', () => {
    it('should return selected items', () => {
      service['items']['active'] = createItemsArray(8);
      service.selectedItems = ['1', '3', '4'];
      const items: Item[] = service.getSelectedItems();
      expect(items[0]).toEqual(service['items']['active'][0]);
      expect(items[1]).toEqual(service['items']['active'][2]);
      expect(items[2]).toEqual(service['items']['active'][3]);
    });
  });

  describe('getItemAndSetBumpExpiringDate', () => {
    it('should return item by id', () => {
      service['items']['active'] = createItemsArray(8);
      expect(service.getItemAndSetBumpExpiringDate('2', 1234)).toEqual(service['items']['active'][1]);
      expect(service['items']['active'][1].bumpExpiringDate).toBe(1234);
    });
    it('should return undefined item if not found', () => {
      service['items']['active'] = createItemsArray(8);
      expect(service.getItemAndSetBumpExpiringDate('20', 1234)).toBeUndefined();
    });
  });

});
