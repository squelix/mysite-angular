import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CoreComponent } from './core/core.component';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot([]),
    ],
    declarations: [
        CoreComponent
    ],
    bootstrap: [
        CoreComponent
    ]
})
export class CoreModule {
}
