import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BmiCardModule } from '@bmi/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { emailVerifiedRoutes } from './email-verified.routing';
import { EmailVerifiedComponent } from './email-verified.component';

@NgModule({
    declarations: [
        EmailVerifiedComponent
    ],
    imports     : [
        RouterModule.forChild(emailVerifiedRoutes),
        MatButtonModule,
        BmiCardModule,
        SharedModule
    ]
})
export class EmailVerifiedModule
{
}
