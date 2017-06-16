/* tslint:disable:no-unused-variable */

import { SanitizedBackgroundDirective } from './sanitized-background.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { IMAGE } from '../../../test/fixtures/user.fixtures';

@Component({
  template: `<div [tslsanitizedBackground]="image"></div>`
})
class TestComponent {
  image: string;
}

describe('Directive: SanitizedBackground', () => {
  let fixture: ComponentFixture<TestComponent>;
  let element: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SanitizedBackgroundDirective,
        TestComponent
      ]
    });
    fixture = TestBed.createComponent(TestComponent);
    element = fixture.debugElement.queryAll(By.directive(SanitizedBackgroundDirective))[0];
  });

  it('should create an instance', () => {
    expect(fixture).toBeTruthy();
  });
  it('Should set the passed url as background-image', () => {
    fixture.componentInstance.image = IMAGE.urls_by_size.medium;
    fixture.detectChanges();
    expect(element.styles['backgroundImage']).toBe(`url(${IMAGE.urls_by_size.medium})`);
  });
});
