import { SmoothScrollToDirective, SmoothScrollDirective } from './ng-smooth-scroll.directive';
import { ElementRef } from '@angular/core';

describe('NgSmoothScrollDirective', () => {
  it('should create an instance', () => {
    const directive = new SmoothScrollToDirective();
    expect(directive).toBeTruthy();
  });

  it('should create an instance', () => {
    const directive = new SmoothScrollDirective(new ElementRef('ref1'));
    expect(directive).toBeTruthy();
  });
});
