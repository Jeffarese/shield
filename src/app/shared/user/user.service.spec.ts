/* tslint:disable:no-unused-variable */

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpService } from '../http/http.service';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ResponseOptions, Response } from '@angular/http';
import { environment } from '../../../environments/environment';
import { User } from './user';
import {
  USER_ID, USER_DATA, MICRO_NAME, USER_LOCATION, STATS,
  VALIDATIONS, VERIFICATION_LEVEL, SCORING_STARS, SCORING_STARTS, RESPONSE_RATE, ONLINE, MOCK_USER_RESPONSE_BODY,
  ACCESS_TOKEN, MOCK_USER
} from '../../../test/fixtures/user.fixtures';
import { EventService } from '../event/event.service';
import { TEST_HTTP_PROVIDERS } from '../../../test/utils';
import { HaversineService } from 'ng2-haversine';
import { MOCK_ITEM, ITEM_LOCATION } from '../../../test/fixtures/item.fixtures';
import { Item } from '../item/item';
import { Observable } from 'rxjs/Observable';
import { I18nService } from '../i18n/i18n.service';

describe('Service: User', () => {

  let service: UserService;
  let mockBackend: MockBackend;
  let http: HttpService;
  let haversineService: HaversineService;
  let response: any;
  const FAKE_USER_NAME: string = 'No disponible';

  const DATA: any = {
    emailAddress: 'test@test.it',
    installationType: 'ANDROID',
    password: 'test'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...TEST_HTTP_PROVIDERS,
        EventService,
        UserService,
        I18nService,
        HaversineService
      ]
    });
    service = TestBed.get(UserService);
    mockBackend = TestBed.get(MockBackend);
    http = TestBed.get(HttpService);
    haversineService = TestBed.get(HaversineService);
    localStorage.removeItem('access_token');
    http['_accessToken'] = null;
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('should return the user', () => {
    let user: User = new User('123');
    service['_user'] = user;
    expect(service.user).toBe(user);
  });

  describe('login', () => {

    beforeEach(fakeAsync(() => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url).toBe(environment.baseUrl + 'shnm-portlet/api/v1/access.json/loginProfessional');
        expect(connection.request.getBody()).toBe('emailAddress=test@test.it&installationType=ANDROID&password=test');
        let res: ResponseOptions = new ResponseOptions({body: JSON.stringify(MOCK_USER_RESPONSE_BODY)});
        connection.mockRespond(new Response(res));
      });
    }));

    it('should call the endpoint and return the User object', fakeAsync(() => {
      service.login(DATA).subscribe((res: any) => {
        response = res;
      });
      tick();
      expect(response).toEqual(MOCK_USER_RESPONSE_BODY);
    }));

    it('should save the access token in local storage', fakeAsync(() => {
      service.login(DATA).subscribe((res: any) => {
        response = res;
      });
      tick();
      let accessToken: any = localStorage.getItem('access_token');
      expect(accessToken).toBeDefined();
      expect(accessToken).toBe(ACCESS_TOKEN);
    }));

    it('should login the user', fakeAsync(() => {
      service.login(DATA).subscribe((res: any) => {
        response = res;
      });
      tick();
      expect(service.isLogged).toBeTruthy();
    }));
  });

  describe('isLogged', () => {

    it('should not be logged', () => {
      expect(service.isLogged).toBeFalsy();
    });

    it('should be logged', () => {
      localStorage.setItem('access_token', 'abc');
      expect(service.isLogged).toBeTruthy();
    });
  });

  describe('get', () => {
    describe('without backend error', () => {
      beforeEach(fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.url).toBe(environment.baseUrl + 'api/v2/users/' + USER_ID);
          let res: ResponseOptions = new ResponseOptions({body: JSON.stringify(USER_DATA)});
          connection.mockRespond(new Response(res));
        });
      }));

      it('should return the User object', fakeAsync(() => {
        let user: User;
        service.get(USER_ID).subscribe((r: User) => {
          user = r;
        });
        expect(user instanceof User).toBeTruthy();
        expect(user.id).toBe(USER_ID);
        expect(user.microName).toBe(MICRO_NAME);
        // expect(user.image).toEqual(IMAGE);
        expect(user.location).toEqual(USER_LOCATION);
        expect(user.stats).toEqual(STATS);
        expect(user.validations).toEqual(VALIDATIONS);
        expect(user.verificationLevel).toBe(VERIFICATION_LEVEL);
        expect(user.scoringStars).toBe(SCORING_STARS);
        expect(user.scoringStarts).toBe(SCORING_STARTS);
        expect(user.responseRate).toBe(RESPONSE_RATE);
        expect(user.online).toBe(ONLINE);
      }));
    });
    describe('with backend error', () => {
      beforeEach(fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockError();
        });
      }));
      it('should return a fake User object', () => {
        let user: User;
        service.get(USER_ID).subscribe((r: User) => {
          user = r;
        });
        expect(user.id).toBe(USER_ID);
        expect(user.microName).toBe(FAKE_USER_NAME);
      });
    });
  });

  describe('me', () => {

    it('should retrieve and return the User object', fakeAsync(() => {
      spyOn(http, 'get').and.callThrough();
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url).toBe(environment.baseUrl + 'api/v2/users/me');
        let res: ResponseOptions = new ResponseOptions({body: JSON.stringify(USER_DATA)});
        connection.mockRespond(new Response(res));
      });
      let user: User;
      service.me().subscribe((r: User) => {
        user = r;
      });
      expect(user instanceof User).toBeTruthy();
      expect(user.id).toBe(USER_ID);
      expect(user.microName).toBe(MICRO_NAME);
      expect(user.image).toBeDefined();
      expect(user.location).toEqual(USER_LOCATION);
      expect(user.stats).toEqual(STATS);
      expect(user.validations).toEqual(VALIDATIONS);
      expect(user.verificationLevel).toBe(VERIFICATION_LEVEL);
      expect(user.scoringStars).toBe(SCORING_STARS);
      expect(user.scoringStarts).toBe(SCORING_STARTS);
      expect(user.responseRate).toBe(RESPONSE_RATE);
      expect(user.online).toBe(ONLINE);
      expect(http.get).toHaveBeenCalled();
    }));

    it('should just return the User object if present', fakeAsync(() => {
      let user: User;
      spyOn(http, 'get');
      service['_user'] = new User('123');
      service.me().subscribe((r: User) => {
        user = r;
      });
      expect(user instanceof User).toBeTruthy();
      expect(user.id).toBe('123');
      expect(http.get).not.toHaveBeenCalled();
    }));

    it('should call http only once', () => {
      spyOn(http, 'get').and.callThrough();
      service.me().subscribe();
      service.me().subscribe();
      expect(http.get).toHaveBeenCalledTimes(1);
    });

  });

  describe('checkUserStatus', () => {

    it('should emit the LOGIN event if the user is logged', fakeAsync(() => {
      localStorage.setItem('access_token', 'abc');
      spyOn(service['event'], 'emit');
      service.checkUserStatus();
      expect(service['event'].emit).toHaveBeenCalledWith(EventService.USER_LOGIN, 'abc');
    }));

    it('should not emit the LOGIN event if the user is not logged', fakeAsync(() => {
      spyOn(service['event'], 'emit');
      service.checkUserStatus();
      expect(service['event'].emit).not.toHaveBeenCalled();
    }));

  });

  describe('logout', () => {

    it('should log out the user', fakeAsync(() => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        let res: ResponseOptions = new ResponseOptions({body: JSON.stringify(MOCK_USER_RESPONSE_BODY)});
        connection.mockRespond(new Response(res));
      });
      service.login(DATA).subscribe();
      expect(service.isLogged).toBeTruthy();
      service.logout();
      expect(service.isLogged).toBeFalsy();
    }));

  });

  describe('calculateDistanceFromItem', () => {

    beforeEach(() => {
      spyOn(haversineService, 'getDistanceInKilometers').and.returnValue(1);
    });

    it('should call the haversineService and return a number', () => {
      let user: User = MOCK_USER;
      let item: Item = MOCK_ITEM;
      let distance: number = service.calculateDistanceFromItem(user, item);
      expect(haversineService.getDistanceInKilometers).toHaveBeenCalledWith({
        latitude: ITEM_LOCATION.approximated_latitude,
        longitude: ITEM_LOCATION.approximated_longitude
      }, {
        latitude: USER_LOCATION.approximated_latitude,
        longitude: USER_LOCATION.approximated_longitude,
      });
      expect(distance).toBe(1);
    });

    it('should not call the haversineService and return null', () => {
      let user: User = new User(USER_ID);
      let item: Item = MOCK_ITEM;
      let distance: number = service.calculateDistanceFromItem(user, item);
      expect(haversineService.getDistanceInKilometers).not.toHaveBeenCalled();
      expect(distance).toBeNull();
    });

  });

  describe('syncStatus', () => {

    it('should call get and set the online value', () => {
      let user: User = MOCK_USER;
      let mockGet: User = MOCK_USER;
      mockGet.online = true;
      spyOn(service, 'get').and.returnValue(Observable.of(mockGet));
      service.syncStatus(user);
      expect(user.online).toBeTruthy();
    });

  });

  describe('getFakeUser', () => {
    it('should return a fake User object', () => {
      let user: User = (service as any).getFakeUser(USER_ID);
      expect(user.id).toBe(USER_ID);
      expect(user.microName).toBe(FAKE_USER_NAME);
    });

  });
});
