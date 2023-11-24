import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BmiAlertModule } from '@bmi/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { LandingContactComponent } from 'app/modules/landing/contact/contact.component';
import { landingContactRoutes } from 'app/modules/landing/contact/contact.routing';

@NgModule({
    declarations: [
        LandingContactComponent
    ],
    imports     : [
        RouterModule.forChild(landingContactRoutes),
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        BmiAlertModule,
        SharedModule
    ]
})
export class LandingContactModule
{
}
