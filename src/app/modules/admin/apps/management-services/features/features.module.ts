import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SharedModule } from 'app/shared/shared.module';
import { ManagementServicesFeaturesComponent } from 'app/modules/admin/apps/management-services/features/features.component';

@NgModule({
    declarations: [
        ManagementServicesFeaturesComponent
    ],
    imports     : [
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        MatProgressBarModule,
        SharedModule
    ],
    exports     : [
        ManagementServicesFeaturesComponent
    ]
})
export class ManagementServicesFeaturesModule
{
}
