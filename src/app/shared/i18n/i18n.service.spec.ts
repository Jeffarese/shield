/* tslint:disable:no-unused-variable */

import { TestBed} from '@angular/core/testing';
import { I18nService } from './i18n.service';

describe('I18nService', () => {

  let service: I18nService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [I18nService]
    });
    service = TestBed.get(I18nService);
  });

  it('should get the en locale', () => {
    expect(service.locale).toBe('en');
  });

  it('should get the es locale', () => {
    service['_locale'] = 'es';
    expect(service.locale).toBe('es');
  });
});
