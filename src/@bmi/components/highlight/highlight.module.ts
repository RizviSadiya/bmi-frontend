import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BmiHighlightComponent } from '@bmi/components/highlight/highlight.component';

@NgModule({
    declarations: [
        BmiHighlightComponent
    ],
    imports     : [
        CommonModule
    ],
    exports     : [
        BmiHighlightComponent
    ]
})
export class BmiHighlightModule
{
}
