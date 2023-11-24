import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BmiCardModule } from '@bmi/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { SocialRedirectComponent } from 'app/modules/auth/social-redirect/social-redirect.component';
import { socialRedirectRoutes } from 'app/modules/auth/social-redirect/social-redirect.routing';
import { InstaRedirectRoutes } from './insta-redirect.routing';
import { InstaRedirectComponent } from './insta-redirect.component';

@NgModule({
    declarations: [
       InstaRedirectComponent
    ],
    imports     : [
        RouterModule.forChild(InstaRedirectRoutes),
        MatButtonModule,
        BmiCardModule,
        SharedModule
    ],
    exports:[InstaRedirectComponent]
})
export class InstaRedirectModule
{
    
}
