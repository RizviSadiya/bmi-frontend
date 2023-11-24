import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { BmiAlertModule } from '@bmi/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { affiliateProgramRoutes } from 'app/modules/admin/apps/affiliate-program/affiliate-program.routing';
import { AffiliateProgramComponent } from 'app/modules/admin/apps/affiliate-program/affiliate-program.component';

@NgModule({
    declarations: [
        AffiliateProgramComponent
    ],
    imports     : [
        RouterModule.forChild(affiliateProgramRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatRippleModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        BmiAlertModule,
        SharedModule
    ]
})
export class AffiliateProgramModule
{
}
