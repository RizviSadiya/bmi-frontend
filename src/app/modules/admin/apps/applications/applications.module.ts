import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_FORMATS, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as moment from 'moment';

import { BmiFindByKeyPipeModule } from '@bmi/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import { BmiAlertModule } from '@bmi/components/alert';
import { applicationsRoutes } from 'app/modules/admin/apps/applications/applications.routing';
import { ApplicationsComponent } from 'app/modules/admin/apps/applications/applications.component';
import { ApplicationsDetailsComponent } from 'app/modules/admin/apps/applications/details/details.component';
import { ApplicationsListComponent } from 'app/modules/admin/apps/applications/list/list.component';
import { ReviewProposalModule } from 'app/layout/common/review-proposal/review-proposal.module';
import { PaymentGuidelinesPopupModule } from 'app/layout/common/payment-guidelines-popup/payment-guidelines-popup.module';
import { SingleCampaignModule } from 'app/layout/common/single-campaign/single-campaign.module';
import {MatPaginatorModule} from '@angular/material/paginator';

@NgModule({
    declarations: [
        ApplicationsComponent,
        ApplicationsListComponent,
        ApplicationsDetailsComponent
    ],
    imports     : [
        RouterModule.forChild(applicationsRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatMomentDateModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatStepperModule,
        MatSidenavModule,
        MatTableModule,
        MatPaginatorModule,
        MatTabsModule,
        MatTooltipModule,
        BmiAlertModule,
        BmiFindByKeyPipeModule,
        SingleCampaignModule,
        ReviewProposalModule,
        PaymentGuidelinesPopupModule,
        SharedModule
    ],
    providers   : [
        {
            provide : MAT_DATE_FORMATS,
            useValue: {
                parse  : {
                    dateInput: moment.ISO_8601
                },
                display: {
                    dateInput         : 'LL',
                    monthYearLabel    : 'MMM YYYY',
                    dateA11yLabel     : 'LL',
                    monthYearA11yLabel: 'MMMM YYYY'
                }
            }
        }
    ]
})
export class ApplicationsModule
{
}
