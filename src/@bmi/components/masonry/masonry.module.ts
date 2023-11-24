import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BmiMasonryComponent } from '@bmi/components/masonry/masonry.component';

@NgModule({
    declarations: [
        BmiMasonryComponent
    ],
    imports     : [
        CommonModule
    ],
    exports     : [
        BmiMasonryComponent
    ]
})
export class BmiMasonryModule
{
}
