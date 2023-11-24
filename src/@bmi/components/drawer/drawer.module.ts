import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BmiDrawerComponent } from '@bmi/components/drawer/drawer.component';

@NgModule({
    declarations: [
        BmiDrawerComponent
    ],
    imports     : [
        CommonModule
    ],
    exports     : [
        BmiDrawerComponent
    ]
})
export class BmiDrawerModule
{
}
