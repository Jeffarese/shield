/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { CallService } from './call.service';
import { TEST_HTTP_PROVIDERS } from '../../../test/utils';
import { MockedItemService } from '../../../test/fixtures/item.fixtures';
import { ItemService } from '../item/item.service';
import { MockedUserService } from '../../../test/fixtures/user.fixtures';
import { UserService } from '../user/user.service';
import { ConversationService } from './conversation.service';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Call } from './call';
import { CALLS_DATA, createCallsArray } from '../../../test/fixtures/call.fixtures';
import { createConversationsArray } from '../../../test/fixtures/conversation.fixtures';
import { Conversation } from './conversation';
import { CallTotals } from './totals.interface';
import { EventService } from '../event/event.service';
import { LeadService } from './lead.service';

let service: CallService;
let userService: UserService;
let itemService: ItemService;
let conversationService: ConversationService;

describe('CallService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CallService,
        EventService,
        ...TEST_HTTP_PROVIDERS,
        {provide: UserService, useClass: MockedUserService},
        {provide: ItemService, useClass: MockedItemService},
        {
          provide: ConversationService, useValue: {
          stream$: new ReplaySubject(),
          archivedStream$: new ReplaySubject(),
          stream() {
          },
          archiveWithPhones() {
          }
        }
        }
      ]
    });
    service = TestBed.get(CallService);
    userService = TestBed.get(UserService);
    itemService = TestBed.get(ItemService);
    conversationService = TestBed.get(ConversationService);
  });

  it('should instantiate the service', () => {
    expect(service).toBeTruthy();
  });

  describe('getLeads', () => {
    const TOTAL: number = 4;
    const EXISTNG_TOTAL: number = 2;
    const SINCE: number = 1234567;
    const QUERY_RESULT: Call[] = createCallsArray(TOTAL);
    let result: Call[];
    describe('with results', () => {
      beforeEach(() => {
        spyOn(service, 'query').and.returnValue(Observable.of(QUERY_RESULT));
        result = null;
      });
      describe('no archive', () => {
        describe('with different conversations', () => {
          beforeEach(() => {
            service.leads = createCallsArray(EXISTNG_TOTAL, undefined, TOTAL);
            service['getLeads'](SINCE, false).subscribe((r: Call[]) => {
              result = r;
            });
          });
          it('should call query', () => {
            expect(service.query).toHaveBeenCalledWith(SINCE, false);
          });
          it('should return the query result', () => {
            expect(result).toEqual(QUERY_RESULT);
          });
          it('should concats calls', () => {
            expect(service.leads.length).toBe(EXISTNG_TOTAL + TOTAL);
          });
        });
        describe('with same conversations', () => {
          it('should not concatenate a conversation with the same id', () => {
            service.leads = createCallsArray(TOTAL);
            service['getLeads'](SINCE, false).subscribe((r: Call[]) => {
              result = r;
            });
            expect(service.leads.length).toBe(TOTAL);
          });
          it('should add the conversations that are not already added', () => {
            service.leads = createCallsArray(EXISTNG_TOTAL);
            service['getLeads'](SINCE, false).subscribe((r: Call[]) => {
              result = r;
            });
            expect(service.leads.length).toBe(TOTAL);
          });
        });
      });
      describe('archive', () => {
        beforeEach(() => {
          service.archivedLeads = createCallsArray(EXISTNG_TOTAL);
          service['getLeads'](SINCE, true).subscribe((r: Call[]) => {
            result = r;
          });
        });
        it('should call query', () => {
          expect(service.query).toHaveBeenCalledWith(SINCE, true);
        });
        it('should return the query result', () => {
          expect(result).toEqual(QUERY_RESULT);
        });
        it('should concats calls', () => {
          expect(service.archivedLeads.length).toBe(EXISTNG_TOTAL + TOTAL);
        });
      });
    });
    describe('with no results', () => {
      beforeEach(() => {
        spyOn(service, 'query').and.returnValue(Observable.of([]));
        result = null;
        service.archivedLeads = createCallsArray(EXISTNG_TOTAL);
        service.leads = createCallsArray(EXISTNG_TOTAL);
        service['getLeads'](SINCE).subscribe((r: Call[]) => {
          result = r;
        });
      });
      it('should return an empty array', () => {
        expect(result).toEqual([]);
      });
      it('should not change leads', () => {
        expect(service.leads.length).toBe(EXISTNG_TOTAL);
        expect(service.archivedLeads.length).toBe(EXISTNG_TOTAL);
      });
    });
  });

  describe('getPage', () => {
    let result: Call[];
    const TOTAL_PHONES: number = 4;
    const TOTAL_CALLS: number = 3;
    const MIXED_CONVERSATIONS: Conversation[] = [...createConversationsArray(6), ...createConversationsArray(TOTAL_PHONES, true)];
    describe('no archive', () => {
      describe('with conversations with phone and calls', () => {
        it('should return conversations with phone converted to calls and concat with calls', () => {
          service.getPage(1).subscribe((r: Call[]) => {
            result = r;
          });
          conversationService.stream$.next(MIXED_CONVERSATIONS);
          service.stream$.next(createCallsArray(TOTAL_CALLS));
        });
        it('should return conversations with phone converted to calls and concat with calls changing events order 1', () => {
          conversationService.stream$.next(MIXED_CONVERSATIONS);
          service.stream$.next(createCallsArray(TOTAL_CALLS));
          service.getPage(1).subscribe((r: Call[]) => {
            result = r;
          });
        });
        it('should return conversations with phone converted to calls and concat with calls changing events order 2', () => {
          service.getPage(1).subscribe((r: Call[]) => {
            result = r;
          });
          service.stream$.next(createCallsArray(TOTAL_CALLS));
          conversationService.stream$.next(MIXED_CONVERSATIONS);
        });
        afterEach(() => {
          expect(result.length).toBe(TOTAL_PHONES + TOTAL_CALLS);
        });
        it('should return conversations with phone converted to calls and concat with calls changing events order 3', () => {
          service.stream$.next(createCallsArray(TOTAL_CALLS));
          service.getPage(1).subscribe((r: Call[]) => {
            result = r;
          });
          conversationService.stream$.next(MIXED_CONVERSATIONS);
        });
        it('should return conversations with phone converted to calls and concat with calls changing events order 4', () => {
          conversationService.stream$.next(MIXED_CONVERSATIONS);
          service.getPage(1).subscribe((r: Call[]) => {
            result = r;
          });
          service.stream$.next(createCallsArray(TOTAL_CALLS));
        });
        afterEach(() => {
          expect(result.length).toBe(TOTAL_PHONES + TOTAL_CALLS);
        });
      });
      describe('with conversations with phone and no calls', () => {
        it('should return conversations with phone converted to calls', () => {
          service.getPage(1).subscribe((r: Call[]) => {
            result = r;
          });
          conversationService.stream$.next(MIXED_CONVERSATIONS);
          service.stream$.next([]);
          expect(result.length).toBe(TOTAL_PHONES);
        });
      });
      describe('with conversations with no phones and some calls', () => {
        it('should return calls', () => {
          service.getPage(1).subscribe((r: Call[]) => {
            result = r;
          });
          conversationService.stream$.next(createConversationsArray(6));
          service.stream$.next(createCallsArray(TOTAL_CALLS));
          expect(result.length).toBe(TOTAL_CALLS);
        });
      });
      describe('with no conversations and some calls', () => {
        it('should return calls', () => {
          service.getPage(1).subscribe((r: Call[]) => {
            result = r;
          });
          conversationService.stream$.next([]);
          service.stream$.next(createCallsArray(TOTAL_CALLS));
          expect(result.length).toBe(TOTAL_CALLS);
        });
      });
    });
    describe('filter', () => {
      it('should filter by status', () => {
        service.getPage(1, false, 'SHARED').subscribe((r: Call[]) => {
          result = r;
        });
        const WITH_SHARED_STATUS: number = 3;
        const MIXED_CALLS: (Call | Conversation)[] = [...createCallsArray(6), ...createConversationsArray(WITH_SHARED_STATUS)];
        service.stream$.next(MIXED_CALLS);
        conversationService.stream$.next([]);
        expect(result.length).toBe(WITH_SHARED_STATUS);
      });
      it('should filter by multiple status', () => {
        service.getPage(1, false, 'ANSWERED,MISSED').subscribe((r: Call[]) => {
          result = r;
        });
        const WITH_ANSWERED_STATUS: number = 3;
        const WITH_MISSED_STATUS: number = 4;
        const MIXED_CALLS: (Call | Conversation)[] = [
          ...createConversationsArray(6),
          ...createCallsArray(WITH_ANSWERED_STATUS, 'ANSWERED'),
          ...createCallsArray(WITH_MISSED_STATUS, 'MISSED')
        ];
        service.stream$.next(MIXED_CALLS);
        conversationService.stream$.next([]);
        expect(result.length).toBe(WITH_ANSWERED_STATUS + WITH_MISSED_STATUS);
      });
    });
    describe('page size', () => {
      it('should paginate with custom page size and return first page', () => {
        service.getPage(1, false, null, 2).subscribe((r: Call[]) => {
          result = r;
        });
        service.stream$.next(createCallsArray(5));
        conversationService.stream$.next([]);
        expect(result.length).toBe(2);
      });
      it('should paginate with custom page size and return first + second page', () => {
        service.getPage(2, false, null, 2).subscribe((r: Call[]) => {
          result = r;
        });
        service.stream$.next(createCallsArray(5));
        conversationService.stream$.next([]);
        expect(result.length).toBe(4);
      });
    });
    describe('archive', () => {
      describe('with conversations with phone and calls', () => {
        it('should return conversations with phone converted to calls and concat with calls', () => {
          service.getPage(1, true).subscribe((r: Call[]) => {
            result = r;
          });
          service.archivedStream$.next(createCallsArray(TOTAL_CALLS));
          conversationService.archivedStream$.next(MIXED_CONVERSATIONS);
          expect(result.length).toBe(TOTAL_PHONES + TOTAL_CALLS);
        });
      });
      describe('with conversations with phone and no calls', () => {
        it('should return conversations with phone converted to calls', () => {
          service.getPage(1, true).subscribe((r: Call[]) => {
            result = r;
          });
          service.archivedStream$.next([]);
          conversationService.archivedStream$.next(MIXED_CONVERSATIONS);
          expect(result.length).toBe(TOTAL_PHONES);
        });
      });
      describe('with conversations with no phones and some calls', () => {
        it('should return calls', () => {
          service.getPage(1, true).subscribe((r: Call[]) => {
            result = r;
          });
          service.archivedStream$.next(createCallsArray(TOTAL_CALLS));
          conversationService.archivedStream$.next(createConversationsArray(6));
          expect(result.length).toBe(TOTAL_CALLS);
        });
      });
      describe('with no conversations and some calls', () => {
        it('should return calls', () => {
          service.getPage(1, true).subscribe((r: Call[]) => {
            result = r;
          });
          service.archivedStream$.next(createCallsArray(TOTAL_CALLS));
          conversationService.archivedStream$.next([]);
          expect(result.length).toBe(TOTAL_CALLS);
        });
      });
    });
  });

  describe('mapRecordData', () => {
    it('should return a Call object', () => {
      const response: Call = (service['mapRecordData'](CALLS_DATA[0]) as Call);
      expect(response instanceof Call).toBeTruthy();
    });
  });

  describe('getTotals', () => {
    it('should return calls total', () => {
      let result: any;
      (service as CallService).getTotals().subscribe((r: CallTotals) => {
        result = r;
      });
      service.stream$.next(createCallsArray(5));
      service.archivedStream$.next(createCallsArray(4));
      expect(result.calls).toBe(5);
      expect(result.archived).toBe(4);
    });
  });

  describe('onArchiveAll', () => {
    const CONVERSATIONS: Conversation[] = createConversationsArray(4);
    const RETURNED_CONVERSATIONS: Conversation[] = createConversationsArray(2);
    beforeEach(() => {
      spyOn(<LeadService>service, 'bulkArchive').and.returnValue(RETURNED_CONVERSATIONS);
      spyOn(service, 'stream');
      spyOn(conversationService, 'stream');
      spyOn(conversationService, 'archiveWithPhones');
      service.leads = CONVERSATIONS;
      service['onArchiveAll']();
    });
    it('should call bulkArchive and archiveWithPhones', () => {
      expect(service['bulkArchive']).toHaveBeenCalledWith(CONVERSATIONS);
      expect(service.leads).toEqual(RETURNED_CONVERSATIONS);
      expect(conversationService.archiveWithPhones).toHaveBeenCalled();
    });
    it('should call streams', () => {
      expect(service.stream).toHaveBeenCalled();
      expect(conversationService.stream).toHaveBeenCalled();
    });
  });
});
