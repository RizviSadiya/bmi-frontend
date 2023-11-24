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
import { managementProgramRoutes } from 'app/modules/admin/apps/management-services/management-services.routing';
import { ManagementServicesComponent } from 'app/modules/admin/apps/management-services/management-services.component';
import { ManagementServicesFeaturesModule } from './features/features.module';

@NgModule({
    declarations: [
        ManagementServicesComponent
    ],
    imports     : [
        RouterModule.forChild(managementProgramRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatRippleModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        BmiAlertModule,
        SharedModule,
        ManagementServicesFeaturesModule
    ]
})
export class ManagementServicesModule
{
}
