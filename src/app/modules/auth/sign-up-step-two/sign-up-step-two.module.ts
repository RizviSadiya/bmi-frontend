import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BmiCardModule } from '@bmi/components/card';
import { BmiAlertModule } from '@bmi/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { AuthSignUpStepTwoComponent } from 'app/modules/auth/sign-up-step-two/sign-up-step-two.component';
import { authSignupStepTwoRoutes } from 'app/modules/auth/sign-up-step-two/sign-up-step-two.routing';

import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY, MatAutocompleteModule } from '@angular/material/autocomplete';
@NgModule({
    declarations: [
        AuthSignUpStepTwoComponent
    ],
    imports     : [
        RouterModule.forChild(authSignupStepTwoRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        BmiCardModule,
        BmiAlertModule,
        MatAutocompleteModule,
        SharedModule
    ]
})
export class AuthSignUpStepTwoModule
{
}
