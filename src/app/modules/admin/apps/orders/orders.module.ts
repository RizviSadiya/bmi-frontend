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
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
import { ordersRoutes } from 'app/modules/admin/apps/orders/orders.routing';
import { OrdersComponent } from 'app/modules/admin/apps/orders/orders.component';
import { OrdersDetailsComponent } from 'app/modules/admin/apps/orders/details/details.component';
import { OrdersListComponent } from 'app/modules/admin/apps/orders/list/list.component';
import { OrderDisputeReasonComponent } from 'app/modules/admin/apps/orders/order-dispute-reason/order-dispute-reason.component';
import { UploadVideoComponent } from 'app/modules/admin/apps/orders/upload-video/upload-video.component';
import { CampaignResourcePreviewComponent } from './campaign-resource-preview/campaign-resource-preview.component';
import { CampaignResourceDocumentComponent } from './campaign-resource-document/campaign-resource-document.component';
import { ReviewVideoComponent } from './review-video/review-video.component';
import { OrderListModule } from 'app/layout/common/order-list/order-list.module';
import { SingleCampaignModule } from 'app/layout/common/single-campaign/single-campaign.module';
import { ReviewPaymentConfirmationComponent } from './review-video/review-payment-confirmation/review-payment-confirmation.component';
import { IncreaseDeadlineComponent } from './increase-deadline/increase-deadline.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {MatPaginatorModule} from '@angular/material/paginator';

@NgModule({
    declarations: [
        OrdersComponent,
        OrdersListComponent,
        OrdersDetailsComponent,
        OrderDisputeReasonComponent,
        UploadVideoComponent,
        CampaignResourcePreviewComponent,
        CampaignResourceDocumentComponent,
        ReviewVideoComponent,
        ReviewPaymentConfirmationComponent,
        IncreaseDeadlineComponent
    ],
    imports     : [
        RouterModule.forChild(ordersRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatDialogModule,
        MatMenuModule,
        MatMomentDateModule,
        MatProgressBarModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatStepperModule,
        MatSidenavModule,
        MatTableModule,
        MatTabsModule,
        MatTooltipModule,
        BmiFindByKeyPipeModule,
        OrderListModule,
        SingleCampaignModule,
        SharedModule,
        AngularEditorModule,
        MatPaginatorModule
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
export class OrdersModule
{
}
