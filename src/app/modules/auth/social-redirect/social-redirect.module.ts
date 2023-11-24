import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BmiCardModule } from '@bmi/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { SocialRedirectComponent } from 'app/modules/auth/social-redirect/social-redirect.component';
import { socialRedirectRoutes } from 'app/modules/auth/social-redirect/social-redirect.routing';

@NgModule({
    declarations: [
        SocialRedirectComponent
    ],
    imports     : [
        RouterModule.forChild(socialRedirectRoutes),
        MatButtonModule,
        BmiCardModule,
        SharedModule
    ]
})
export class SocialRedirectModule
{
}
