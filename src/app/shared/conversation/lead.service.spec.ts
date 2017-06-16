/* tslint:disable:no-unused-variable */

import { TestBed} from '@angular/core/testing';
import { LeadService } from './lead.service';
import { HttpService } from '../http/http.service';
import { UserService } from '../user/user.service';
import { ItemService } from '../item/item.service';
import { TEST_HTTP_PROVIDERS } from '../../../test/utils';
import { MockedUserService, USER_ID, USER_ITEM_DISTANCE } from '../../../test/fixtures/user.fixtures';
import { MockedItemService, ITEM_ID } from '../../../test/fixtures/item.fixtures';
import { Conversation } from './conversation';
import {
  createConversationsArray, CONVERSATIONS_DATA
} from '../../../test/fixtures/conversation.fixtures';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { User } from '../user/user';
import { Item } from '../item/item';
import { ConversationResponse } from './conversation-response.interface';
import { EventService } from '../event/event.service';
import { Lead } from './lead';

@Injectable()
export class MockService extends LeadService {

  protected API_URL: string = 'api/v3/protool/conversations';
  protected ARCHIVE_URL: string = 'api/v2/conversations';

  constructor(http: HttpService,
              userService: UserService,
              itemService: ItemService,
              event: EventService) {
    super(http, userService, itemService, event);
  }

  protected getLeads(since?: number, concat?: boolean, archived?: boolean): Observable<Conversation[]> {
    return Observable.of({});
  }

  protected onArchiveAll() {
  }

  protected onArchive(lead: Lead) {
  }

  protected mapRecordData(data: ConversationResponse): Conversation {
    return new Conversation(
      data.id,
      data.legacy_id,
      data.modified_date,
      data.expected_visit,
      data.user,
      data.item,
      [],
      data.buyer_phone_number,
      data.survey_responses
    );
  }
}

let service: MockService;
let http: HttpService;
let userService: UserService;
let itemService: ItemService;
let eventService: EventService;

describe('LeadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockService,
        EventService,
        ...TEST_HTTP_PROVIDERS,
        {provide: UserService, useClass: MockedUserService},
        {provide: ItemService, useClass: MockedItemService}
      ]
    });
    service = TestBed.get(MockService);
    userService = TestBed.get(UserService);
    itemService = TestBed.get(ItemService);
    eventService = TestBed.get(EventService);
    http = TestBed.get(HttpService);
  });

  it('should instantiate the service', () => {
    expect(service).toBeTruthy();
  });

  describe('init', () => {
    const CONVERSATIONS: Conversation[] = createConversationsArray(4);
    let response: Conversation[];
    let response2: Conversation[];
    beforeEach(() => {
      spyOn(service, 'getAllLeads').and.callFake(() => {
        return Observable.of(CONVERSATIONS);
      });
      response = null;
      response2 = null;
      service.leads = [];
    });
    describe('not archived', () => {
      it('should call getAllLeads and return conversations', () => {
        service.init().subscribe((r: Conversation[]) => {
          response = r;
        });
        expect(service['getAllLeads']).toHaveBeenCalledWith(null, undefined);
        expect(response).toEqual(CONVERSATIONS);
      });
      it('should stream result', () => {
        service.stream$.subscribe((r: Conversation[]) => {
          response = r;
        });
        service.init().subscribe();
        expect(response).toEqual(CONVERSATIONS);
      });
    });
    describe('archived', () => {
      it('should call getAllLeads and return conversations', () => {
        service.init(true).subscribe((r: Conversation[]) => {
          response = r;
        });
        expect(service['getAllLeads']).toHaveBeenCalledWith(null, true);
        expect(response).toEqual(CONVERSATIONS);
      });
      it('should stream result', () => {
        service.archivedStream$.subscribe((r: Conversation[]) => {
          response = r;
        });
        service.init(true).subscribe();
        expect(response).toEqual(CONVERSATIONS);
      });
    });

  });

  describe('getAllLeads', () => {
    const CONVERSATIONS: Conversation[] = createConversationsArray(4);
    let response: Conversation[];
    beforeEach(() => {
      spyOn(service, 'getLeads').and.returnValues(
        Observable.of(createConversationsArray(4)),
        Observable.of(createConversationsArray(2)),
        Observable.of([]));
    });
    describe('not archived', () => {
      it('should call getLeads twice', () => {
        service['getAllLeads']().subscribe();
        expect(service['getLeads']).toHaveBeenCalledTimes(3);
      });
      it('should return conversations', () => {
        service.leads = CONVERSATIONS;
        service['getAllLeads']().subscribe((r: Conversation[]) => {
          response = r;
        });
        expect(response).toEqual(CONVERSATIONS);
      });
    });
    describe('archived', () => {
      it('should call getLeads twice', () => {
        service['getAllLeads'](null, null, true).subscribe();
        expect(service['getLeads']).toHaveBeenCalledTimes(3);
      });
      it('should return archived conversations', () => {
        service.archivedLeads = CONVERSATIONS;
        service.leads = null;
        service['getAllLeads'](null, true).subscribe((r: Conversation[]) => {
          response = r;
        });
        expect(response).toEqual(CONVERSATIONS);
      });
    });
  });

  describe('getLastDate', () => {
    const CONVERSATIONS: Conversation[] = createConversationsArray(4);
    const DATE: number = 123456;
    CONVERSATIONS[3].modifiedDate = DATE;
    it('should return the last conversation date', () => {
      let response = service['getLastDate'](CONVERSATIONS);
      expect(response).toBe(DATE - 1);
    });
  });

  describe('query', () => {
    const RESPONSE: Response = new Response(new ResponseOptions({body: JSON.stringify(CONVERSATIONS_DATA)}));
    describe('with backend errors', () => {
      beforeEach(() => {
        let mockBackend: MockBackend = TestBed.get(MockBackend);
        mockBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockError();
        });
      });
      it('should return an observable of null', () => {
        let observableResponse: any;
        service.query(12345).subscribe((r: any) => {
          observableResponse = r;
        });
        expect(observableResponse).toBe(null);
      });
    });
    describe('with data', () => {
      beforeEach(() => {
        spyOn(http, 'get').and.returnValues(Observable.of(RESPONSE));
      });
      describe('with no params', () => {
        let conversations: Conversation[];
        let baseTime: number;
        beforeEach(() => {
          spyOn(userService, 'get').and.callThrough();
          spyOn(itemService, 'get').and.callThrough();
          baseTime = new Date().getTime();
          spyOn(window, 'Date').and.returnValue({
            getTime: () => {
              return baseTime;
            }
          });
        });
        describe('no archive', () => {
          beforeEach(() => {
            service.query().subscribe((res: Conversation[]) => {
              conversations = res;
            });
          });
          it('should call the http.get method with hidden false', () => {
            expect(http.get).toHaveBeenCalledWith('api/v3/protool/conversations', {until: baseTime, hidden: false});
          });
          it('should return a conversations array', () => {
            expect(conversations instanceof Array).toBeTruthy();
            expect(conversations.length).toBe(2);
            expect(conversations[0] instanceof Conversation).toBeTruthy();
            expect(conversations[1] instanceof Conversation).toBeTruthy();
          });
          it('should get and map the User', () => {
            expect(userService.get).toHaveBeenCalledWith(USER_ID);
            expect(userService.get).toHaveBeenCalledTimes(2);
            expect(conversations[0].user instanceof User).toBeTruthy();
            expect(conversations[1].user instanceof User).toBeTruthy();
          });
          it('should get and map the Item', () => {
            expect(itemService.get).toHaveBeenCalledWith(ITEM_ID);
            expect(itemService.get).toHaveBeenCalledTimes(2);
            expect(conversations[0].item instanceof Item).toBeTruthy();
            expect(conversations[1].item instanceof Item).toBeTruthy();
            expect(conversations[0].user.itemDistance).toBe(USER_ITEM_DISTANCE);
          });
          it('should set archived false', () => {
            expect(conversations[0].archived).toBeFalsy();
          });
        });
        describe('archive', () => {
          beforeEach(() => {
            service.query(null, true).subscribe((res: Conversation[]) => {
              conversations = res;
            });
          });
          it('should call the http.get method with hidden true', () => {
            expect(http.get).toHaveBeenCalledWith('api/v3/protool/conversations', {until: baseTime, hidden: true});
          });
          it('should set archived true', () => {
            expect(conversations[0].archived).toBeTruthy();
          });
        });
      });
      it('should call the http.get method with the since and hidden param', () => {
        service.query(12345, true).subscribe();
        expect(http.get).toHaveBeenCalledWith('api/v3/protool/conversations', {until: 12345, hidden: true});
      });
    });
  });

  describe('resetCache', () => {
    it('should reset objects', () => {
      service.leads = createConversationsArray(4);
      service.archivedLeads = createConversationsArray(4);
      service.firstLoad = false;
      service.resetCache();
      expect(service.leads.length).toBe(0);
      expect(service.archivedLeads.length).toBe(0);
      expect(service.firstLoad).toBeTruthy();
    });
  });

  describe('archive', () => {
    let archivedConv: Conversation;
    let response: Conversation;
    beforeEach(() => {
      service.leads = createConversationsArray(5);
      archivedConv = <Conversation>service.leads[2];
      spyOn(http, 'put').and.returnValue(Observable.of({}));
      spyOn(eventService, 'emit');
      spyOn(service, 'onArchive');
      response = null;
    });
    describe('conversation found', () => {
      beforeEach(() => {
        service.archive(archivedConv.id).subscribe((r: Conversation) => {
          response = r;
        });
      });
      it('return an observable with the put call to the delete conversation endpoint', () => {
        expect(http.put).toHaveBeenCalledWith(`api/v2/conversations/${archivedConv.id}/hide`, {});
      });
      it('should remove conversation', () => {
        expect(service.leads).not.toContain(archivedConv);
      });
      it('should move conversation to archived array', () => {
        expect(service.archivedLeads).toContain(archivedConv);
      });
      it('should set conversation as archived', () => {
        expect(archivedConv.archived).toBeTruthy();
      });
      it('should return deleted conversation', () => {
        expect(response).toEqual(archivedConv);
      });
      it('should emit event', () => {
        expect(eventService.emit).toHaveBeenCalledWith(EventService.LEAD_ARCHIVED, archivedConv);
      });
      it('should call onArchive', () => {
        expect(service['onArchive']).toHaveBeenCalledWith(archivedConv);
      });
    });
    describe('conversation NOT found', () => {
      beforeEach(() => {
        service.archive('10').subscribe((r: Conversation) => {
          response = r;
        });
      });
      it('should NOT remove conversation', () => {
        expect(service.leads.length).toBe(5);
      });
      it('should NOT move conversation to archived array', () => {
        expect(service.archivedLeads.length).toBe(0);
      });
      it('should NOT return deleted conversation', () => {
        expect(response).toBeUndefined();
      });
    });
  });

  describe('unarchive', () => {
    let unarchivedConv: Conversation;
    let response: Conversation;
    beforeEach(() => {
      service.archivedLeads = createConversationsArray(5);
      unarchivedConv = <Conversation>service.archivedLeads[2];
      spyOn(http, 'put').and.returnValue(Observable.of({}));
      spyOn(service, 'stream');
      response = null;
    });
    describe('conversation found', () => {
      beforeEach(() => {
        service.unarchive(unarchivedConv.id).subscribe((r: Conversation) => {
          response = r;
        });
      });
      it('return an observable with the put call to the delete conversation endpoint', () => {
        expect(http.put).toHaveBeenCalledWith(`api/v2/conversations/${unarchivedConv.id}/unhide`, {});
      });
      it('should remove conversation', () => {
        expect(service.archivedLeads).not.toContain(unarchivedConv);
      });
      it('should move conversation to leads array', () => {
        expect(service.leads).toContain(unarchivedConv);
      });
      it('should set conversation as unarchived', () => {
        expect(unarchivedConv.archived).toBeFalsy();
      });
      it('should return deleted conversation', () => {
        expect(response).toEqual(unarchivedConv);
      });
      it('should call stream', () => {
        expect(service.stream).toHaveBeenCalledWith(true);
      });
    });
    describe('conversation NOT found', () => {
      beforeEach(() => {
        service.unarchive('10').subscribe((r: Conversation) => {
          response = r;
        });
      });
      it('should NOT remove conversation', () => {
        expect(service.archivedLeads.length).toBe(5);
      });
      it('should NOT move conversation to leads array', () => {
        expect(service.leads.length).toBe(0);
      });
      it('should NOT return deleted conversation', () => {
        expect(response).toBeUndefined();
      });
    });
  });

  describe('archiveAll', () => {
    let baseTime: number;
    beforeEach(() => {
      spyOn(http, 'put').and.returnValue(Observable.of({}));
      spyOn(service, 'onArchiveAll');
      baseTime = new Date().getTime();
      spyOn(window, 'Date').and.returnValue({
        getTime: () => {
          return baseTime;
        }
      });
    });
    it('should call http.put with current time', () => {
      service.archiveAll().subscribe();
      expect(http.put).toHaveBeenCalledWith('api/v2/conversations/hide?until=' + baseTime);
    });
    it('should call http.put with passed time', () => {
      service.archiveAll(12345).subscribe();
      expect(http.put).toHaveBeenCalledWith('api/v2/conversations/hide?until=12345');
    });
    it('should call onArchiveAll', () => {
      service.archiveAll().subscribe();
      expect(service['onArchiveAll']).toHaveBeenCalled();
    });
  });

  describe('bulkArchive', () => {
    it('should set archived true to every lead', () => {
      service.archivedLeads = [];
      service['bulkArchive'](createConversationsArray(4));
      expect(service.archivedLeads.length).toBe(4);
      service.archivedLeads.forEach((lead: Conversation) => {
        expect(lead.archived).toBeTruthy();
      });
    });
    it('should return []', () => {
      expect(service['bulkArchive'](createConversationsArray(4))).toEqual([]);
    });
  });

  describe('stream', () => {
    it('should stream leads', () => {
      let response: Conversation[];
      const CONVERSATIONS: Conversation[] = createConversationsArray(4);
      service.leads = CONVERSATIONS;
      service.stream$.subscribe((r: Conversation[]) => {
        response = r;
      });
      service.stream();
      expect(response).toEqual(CONVERSATIONS);
    });
    it('should stream archived leads', () => {
      let response: Conversation[];
      const CONVERSATIONS: Conversation[] = createConversationsArray(4);
      service.archivedLeads = CONVERSATIONS;
      service.archivedStream$.subscribe((r: Conversation[]) => {
        response = r;
      });
      service.stream(true);
      expect(response).toEqual(CONVERSATIONS);
    });
  });
});
