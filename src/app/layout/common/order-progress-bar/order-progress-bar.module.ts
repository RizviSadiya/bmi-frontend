import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { SharedModule } from 'app/shared/shared.module';
import { OrderProgressBarComponent } from 'app/layout/common/order-progress-bar/order-progress-bar.component';

@NgModule({
    declarations: [
        OrderProgressBarComponent
    ],
    imports: [
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        MatStepperModule,
        MatTooltipModule,
        MatProgressBarModule,
        SharedModule
    ],
    exports: [
        OrderProgressBarComponent
    ]
})
export class OrderProgressBarModule {
}
