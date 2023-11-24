import { NgModule } from '@angular/core';
import { BmiScrollResetDirective } from '@bmi/directives/scroll-reset/scroll-reset.directive';

@NgModule({
    declarations: [
        BmiScrollResetDirective
    ],
    exports     : [
        BmiScrollResetDirective
    ]
})
export class BmiScrollResetModule
{
}
