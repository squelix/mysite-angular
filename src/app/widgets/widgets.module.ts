import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgStickyDirective } from './ng-sticky/ng-sticky.directive';
import { SmoothScrollDirective, SmoothScrollToDirective } from './ng-smooth-scroll/ng-smooth-scroll.directive';

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [
        NgStickyDirective,
        SmoothScrollDirective,
        SmoothScrollToDirective,
    ],
    declarations: [
        NgStickyDirective,
        SmoothScrollDirective,
        SmoothScrollToDirective
    ]
})
export class WidgetsModule {
}
