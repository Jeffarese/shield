/* tslint:disable:no-unused-variable */

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CallStatusLabelPipe } from './call-status-label.pipe';
import { I18nService } from '../i18n/i18n.service';
import { Component } from '@angular/core';

@Component({
  selector: 'tsl-test',
  template: '{{callStatus | callStatusLabel}}'
})
class TestComponent {
  callStatus: string;
}

let component: TestComponent;
let fixture: ComponentFixture<TestComponent>;

describe('CallStatusLabelPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        I18nService
      ],
      declarations: [
        TestComponent,
        CallStatusLabelPipe
      ]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });
  it('should return Shared Phone', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.innerText).toBe('Shared Phone');
  });
  it('should return Missed Call', () => {
    component.callStatus = 'MISSED';
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.innerText).toBe('Missed Call');
  });
  it('should return Missed Call', () => {
    component.callStatus = 'ANSWERED';
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.innerText).toBe('Received Call');
  });
});
