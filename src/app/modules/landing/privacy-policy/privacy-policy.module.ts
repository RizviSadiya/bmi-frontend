import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { LandingPrivacyPolicyComponent } from 'app/modules/landing/privacy-policy/privacy-policy.component';
import { landingPrivacyPolicyRoutes } from 'app/modules/landing/privacy-policy/privacy-policy.routing';

@NgModule({
    declarations: [
        LandingPrivacyPolicyComponent
    ],
    imports     : [
        RouterModule.forChild(landingPrivacyPolicyRoutes),
        SharedModule
    ]
})
export class LandingPrivacyPolicyModule
{
}
