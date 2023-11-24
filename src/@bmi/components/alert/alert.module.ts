import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BmiAlertComponent } from '@bmi/components/alert/alert.component';

@NgModule({
    declarations: [
        BmiAlertComponent
    ],
    imports     : [
        CommonModule,
        MatButtonModule,
        MatIconModule
    ],
    exports     : [
        BmiAlertComponent
    ]
})
export class BmiAlertModule
{
}
