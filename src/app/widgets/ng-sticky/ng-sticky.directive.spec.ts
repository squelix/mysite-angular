import { NgStickyDirective } from './ng-sticky.directive';
import { ElementRef } from '@angular/core';

describe('NgStickyDirective', () => {

    const rendererMock = jasmine.createSpyObj('rendererMock', ['removeClass', 'addClass']);

    it('should create an instance', () => {
    const directive = new NgStickyDirective(new ElementRef('ref1'), rendererMock);
    expect(directive).toBeTruthy();
  });
});
