import { TestBed } from '@angular/core/testing';
import { LoggedGuard } from './logged.guard';
import { UserService } from './user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { EventService } from '../event/event.service';
import { TEST_HTTP_PROVIDERS } from '../../../test/utils';
import { HaversineService } from 'ng2-haversine';
import { I18nService } from '../i18n/i18n.service';
import { Component } from '@angular/core';

@Component({
  template: '<router-outlet></router-outlet>'
})
class RoutingComponent {
}

@Component({
  template: ''
})
class TestComponent {
}

let service: LoggedGuard;
let userService: UserService;

describe('Guard: logged', () => {

  const activatedRoute: any = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'login', component: TestComponent}
        ])
      ],
      declarations: [
        RoutingComponent,
        TestComponent
      ],
      providers: [
        ...TEST_HTTP_PROVIDERS,
        UserService,
        I18nService,
        EventService,
        LoggedGuard,
        HaversineService
      ]
    });
    TestBed.createComponent(RoutingComponent);
    service = TestBed.get(LoggedGuard);
    userService = TestBed.get(UserService);
    localStorage.removeItem('access_token');
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('should allow to access if logged', () => {
    localStorage.setItem('access_token', 'abc');
    expect(service.canActivate(activatedRoute)).toBeTruthy();
  });

  it('should prevent from accessing if not logged', () => {
    expect(service.canActivate(activatedRoute)).toBeFalsy();
  });

  it('should redirect to login if not logged', () => {
    const location: Location = TestBed.get(Location);
    service.canActivate(activatedRoute);
    location.subscribe((loc) => {
      expect(loc.url).toBe('/login');
    });
  });

  it('should save queryParams if not logged', () => {
    activatedRoute.queryParams = {
      c: '123'
    };
    service.canActivate(activatedRoute);
    expect(userService.queryParams).toEqual(activatedRoute.queryParams);
  });

});
