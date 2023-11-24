import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BmiCardComponent } from '@bmi/components/card/card.component';

@NgModule({
    declarations: [
        BmiCardComponent
    ],
    imports     : [
        CommonModule
    ],
    exports     : [
        BmiCardComponent
    ]
})
export class BmiCardModule
{
}
