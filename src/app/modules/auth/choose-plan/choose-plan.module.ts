import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BmiCardModule } from '@bmi/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { AuthChoosePlanComponent } from 'app/modules/auth/choose-plan/choose-plan.component';
import { authChoosePlanRoutes } from 'app/modules/auth/choose-plan/choose-plan.routing';
import { PricingPlanModule } from 'app/layout/common/pricing-plan/pricing-plan.module';

@NgModule({
    declarations: [
        AuthChoosePlanComponent
    ],
    imports     : [
        RouterModule.forChild(authChoosePlanRoutes),
        MatButtonModule,
        BmiCardModule,
        PricingPlanModule,
        SharedModule
    ]
})
export class AuthChoosePlanModule
{
}
