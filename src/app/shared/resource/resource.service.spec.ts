/* tslint:disable:no-unused-variable */

import { TestBed, fakeAsync } from '@angular/core/testing';
import { ResourceService } from './resource.service';
import { HttpService } from '../http/http.service';
import { ResponseOptions, Response } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Injectable } from '@angular/core';
import { USER_ID, USER_DATA } from '../../../test/fixtures/user.fixtures';
import { environment } from '../../../environments/environment';
import { TEST_HTTP_PROVIDERS } from '../../../test/utils';
import { Observable } from 'rxjs/Observable';


class User {
  constructor(public id: string, public microName: string) {
  }
}

@Injectable()
class UserService extends ResourceService {
  protected API_URL_V2: string = 'api/v2/users';

  constructor(http: HttpService) {
    super(http);
  }

  protected mapRecordData(data: any): any {
    return new User(data.id, data.microName);
  }
}

describe('Service: Resource', () => {

  let service: UserService;
  let mockBackend: MockBackend;
  let http: HttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...TEST_HTTP_PROVIDERS,
        UserService
      ]
    });
    service = TestBed.get(UserService);
    mockBackend = TestBed.get(MockBackend);
    http = TestBed.get(HttpService);
  });

  it('should create the instance', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {

    describe('data is present', () => {

      beforeEach(fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.url).toBe(environment.baseUrl + 'api/v2/users/' + USER_ID);
          let res: ResponseOptions = new ResponseOptions({body: JSON.stringify(USER_DATA)});
          connection.mockRespond(new Response(res));
        });
      }));

      it('should make the http get and call the mapRecordData method', fakeAsync(() => {
        let res: any;
        spyOn(service, 'mapRecordData').and.callThrough();
        service.get(USER_ID).subscribe((user: User) => {
          res = user;
        });
        expect(service['mapRecordData']).toHaveBeenCalled();
        expect(res instanceof User).toBeTruthy();
      }));

      it('should cache the model in the store', fakeAsync(() => {
        let user1: User, user2: User;
        spyOn(http, 'get').and.callThrough();
        service.get(USER_ID).subscribe((user: User) => {
          user1 = user;
        });
        expect(http.get).toHaveBeenCalled();
        expect(service['store'][USER_ID]).toBeDefined();
        expect(service['store'][USER_ID]).toEqual(user1);
        http.get['calls'].reset();
        service.get(USER_ID).subscribe((user: User) => {
          user2 = user;
        });
        expect(http.get).not.toHaveBeenCalled();
        expect(user1).toEqual(user2);
      }));

      it('should NOT cache the model in the store', fakeAsync(() => {
        let user1: User, user2: User;
        spyOn(http, 'get').and.callThrough();
        service.get(USER_ID).subscribe((user: User) => {
          user1 = user;
        });
        expect(http.get).toHaveBeenCalled();
        expect(service['store'][USER_ID]).toBeDefined();
        expect(service['store'][USER_ID]).toEqual(user1);
        http.get['calls'].reset();
        service.get(USER_ID, true).subscribe((user: User) => {
          user2 = user;
        });
        expect(http.get).toHaveBeenCalled();
      }));

      it('should handle multiple calls', fakeAsync(() => {
        let user1: User, user2: User;
        spyOn(http, 'get').and.callThrough();
        Observable.forkJoin([
          service.get(USER_ID),
          service.get(USER_ID)
        ]).subscribe((data: any[]) => {
          user1 = data[0];
          user2 = data[1];
        });
        expect(http.get).toHaveBeenCalledTimes(1);
        expect(service['store'][USER_ID]).toBeDefined();
        expect(service['store'][USER_ID]).toEqual(user1);
        expect(user1).toEqual(user2);
      }));

    });

    describe('data is NOT present', () => {

      beforeEach(fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          let res: ResponseOptions = new ResponseOptions({body: JSON.stringify({})});
          connection.mockRespond(new Response(res));
        });
      }));

      it('should NOT cache the model in the store', fakeAsync(() => {
        let user1: User;
        spyOn(http, 'get').and.callThrough();
        service.get(USER_ID).subscribe((user: User) => {
          user1 = user;
        });
        expect(user1).toBeNull();
        expect(service['store'][USER_ID]).toBeUndefined();
      }));

    });

  });

});
