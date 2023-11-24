import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BmiAlertModule } from '@bmi/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { DashboardComponent } from 'app/modules/admin/dashboard/dashboard.component';
import { dashboardRoutes } from 'app/modules/admin/dashboard/dashboard.routing';
import { AllChannelsModule } from 'app/layout/common/channel/all-channels.module';
import { InfluencerChannelModule } from 'app/layout/common/influencer-channel/influencer-channel.module';
import { GettingStartedModule } from 'app/layout/common/getting-started/getting-started.module';
import { InformationReviewPopupComponent } from 'app/layout/common/information-review-popup/information-review-popup.component';
import { InfluencerWelcomePopupComponent } from 'app/layout/common/influencer-welcome-popup/influencer-welcome-popup.component';
import { VerifyChannelPopupComponent } from 'app/layout/common/verify-channel-popup/verify-channel-popup.component';
import { UpdateCategoryPopupComponent } from 'app/layout/common/update-category-popup/update-category-popup.component';
import { ListSelectionPopupComponent } from 'app/layout/common/list-selection-popup/list-selection-popup.component';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
    declarations: [
        DashboardComponent,
        InformationReviewPopupComponent,
        InfluencerWelcomePopupComponent,
        VerifyChannelPopupComponent,
        UpdateCategoryPopupComponent,
        ListSelectionPopupComponent
    ],
    imports     : [
        RouterModule.forChild(dashboardRoutes),
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSidenavModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatTooltipModule,
        MatInputModule,
        MatSelectModule,
        MatRadioModule,
        MatDialogModule,
        NgApexchartsModule,
        BmiAlertModule,
        TranslocoModule,
        SharedModule,
        AllChannelsModule,
        InfluencerChannelModule,
        GettingStartedModule,
        MatPaginatorModule,
    ]
})
export class DashboardModule
{
}
