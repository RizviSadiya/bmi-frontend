import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BmiCardModule } from '@bmi/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { PricingPlanComponent } from 'app/layout/common/pricing-plan/pricing-plan.component';

@NgModule({
    declarations: [
        PricingPlanComponent
    ],
    imports: [
        MatButtonModule,
        MatIconModule,
        BmiCardModule,
        SharedModule
    ],
    exports     : [
        PricingPlanComponent
    ]
})
export class PricingPlanModule {
}
