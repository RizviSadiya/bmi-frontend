import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { LandingTermsOfUseComponent } from 'app/modules/landing/terms-of-use/terms-of-use.component';
import { landingTermsRoutes } from 'app/modules/landing/terms-of-use/terms-of-use.routing';

@NgModule({
    declarations: [
        LandingTermsOfUseComponent
    ],
    imports     : [
        RouterModule.forChild(landingTermsRoutes),
        SharedModule
    ]
})
export class LandingTermsOfUseModule
{
}
