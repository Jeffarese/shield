import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { EventService } from '../event/event.service';
import { TEST_HTTP_PROVIDERS } from '../../../test/utils';
import { HaversineService } from 'ng2-haversine';
import { AlreadyLoggedGuard } from './alreadyLogged.guard';
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

let service: AlreadyLoggedGuard;

describe('Guard: alreadyLogged', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'login', component: TestComponent},
          {path: 'chat', component: TestComponent}
        ])
      ],
      declarations: [
        RoutingComponent,
        TestComponent
      ],
      providers: [
        ...TEST_HTTP_PROVIDERS,
        UserService,
        EventService,
        I18nService,
        AlreadyLoggedGuard,
        HaversineService
      ]
    });
    TestBed.createComponent(RoutingComponent);
    service = TestBed.get(AlreadyLoggedGuard);
    localStorage.removeItem('access_token');
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('should prevent from accessing if logged', () => {
    localStorage.setItem('access_token', 'abc');
    expect(service.canActivate()).toBeFalsy();
  });

  it('should allow to access if not logged', () => {
    expect(service.canActivate()).toBeTruthy();
  });

  it('should redirect to / if logged', () => {
    localStorage.setItem('access_token', 'abc');
    const location: Location = TestBed.get(Location);
    service.canActivate();
    location.subscribe((loc) => {
      expect(loc.url).toBe('/');
    });
  });

});
