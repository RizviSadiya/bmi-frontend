import { NgModule } from '@angular/core';
import { BmiScrollbarDirective } from '@bmi/directives/scrollbar/scrollbar.directive';

@NgModule({
    declarations: [
        BmiScrollbarDirective
    ],
    exports     : [
        BmiScrollbarDirective
    ]
})
export class BmiScrollbarModule
{
}
