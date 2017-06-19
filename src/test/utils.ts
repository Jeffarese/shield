import { BaseRequestOptions, ConnectionBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { HttpService } from '../app/shared/http/http.service';

export const TEST_HTTP_PROVIDERS: any[] = [{
  provide: HttpService, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
    return new HttpService(backend, defaultOptions);
  }, deps: [MockBackend, BaseRequestOptions]},
  MockBackend,
  BaseRequestOptions
];
