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
import { MatDialogModule } from '@angular/material/dialog';
import {MatPaginatorModule} from '@angular/material/paginator';
import { NgApexchartsModule } from 'ng-apexcharts';
import * as moment from 'moment';
import { ImageCropperModule } from 'ngx-image-cropper';

import { BmiFindByKeyPipeModule } from '@bmi/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import { BmiAlertModule } from '@bmi/components/alert';
import { campaignsRoutes } from 'app/modules/admin/apps/campaigns/campaigns.routing';
import { CampaignsComponent } from 'app/modules/admin/apps/campaigns/campaigns.component';
import { CampaignsDetailsComponent } from 'app/modules/admin/apps/campaigns/details/details.component';
import { CampaignsListComponent } from 'app/modules/admin/apps/campaigns/list/list.component';
import { CampaignsPostComponent } from 'app/modules/admin/apps/campaigns/post/post.component';
import { CampaignResponsesComponent } from 'app/modules/admin/apps/campaigns/responses/responses.component';
import { SingleCampaignModule } from 'app/layout/common/single-campaign/single-campaign.module';
import { ReviewProposalModule } from 'app/layout/common/review-proposal/review-proposal.module';
import { PaymentGuidelinesPopupModule } from 'app/layout/common/payment-guidelines-popup/payment-guidelines-popup.module';
import { SingleBrandModule } from 'app/layout/common/single-brand/single-brand.module';
import { InfluencerChannelModule } from 'app/layout/common/influencer-channel/influencer-channel.module';
import { HireConfirmationPopupModule } from 'app/layout/common/hire-confirmation-popup/hire-confirmation-popup.module';
import { PendingChangesGuard } from './pending-changes.guard';
import { SelectCategoryPopupComponent } from 'app/layout/common/select-category-popup/select-category-popup.component';
import { CropImageComponent } from './crop-image/crop-image.component';
import {MatSliderModule} from '@angular/material/slider';
import { CampaignsAlertPopupComponent } from './campaigns-alert-popup/campaigns-alert-popup.component';
import { ProposalHostoryComponent } from './proposal-hostory/proposal-hostory.component';
import { PreviewCampaignComponent } from './preview-campaign/preview-campaign.component';
import { RevealChannelpopupComponent } from './reveal-channelpopup/reveal-channelpopup.component';
import { ReversePipe } from './reverse.pipe';
@NgModule({
    declarations: [
        CampaignsComponent,
        CampaignsListComponent,
        CampaignsDetailsComponent,
        CampaignsPostComponent,
        CampaignResponsesComponent,
        SelectCategoryPopupComponent,
        CropImageComponent,
        CampaignsAlertPopupComponent,
        ProposalHostoryComponent,
        PreviewCampaignComponent,
        RevealChannelpopupComponent,
        ReversePipe
    ],
    imports: [
        RouterModule.forChild(campaignsRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDividerModule,
        MatFormFieldModule,
        MatSliderModule,
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
        MatTabsModule,
        MatTooltipModule,
        MatDialogModule,
        MatPaginatorModule,
        BmiFindByKeyPipeModule,
        SingleCampaignModule,
        SingleBrandModule,
        BmiAlertModule,
        ReviewProposalModule,
        PaymentGuidelinesPopupModule,
        InfluencerChannelModule,
        HireConfirmationPopupModule,
        NgApexchartsModule,
        ImageCropperModule,
        SharedModule
    ],
    providers: [
        PendingChangesGuard,
        {
            provide: MAT_DATE_FORMATS,
            useValue: {
                parse: {
                    dateInput: moment.ISO_8601
                },
                display: {
                    dateInput: 'LL',
                    monthYearLabel: 'MMM YYYY',
                    dateA11yLabel: 'LL',
                    monthYearA11yLabel: 'MMMM YYYY'
                }
            }
        }
    ]
})
export class CampaignsModule {
}
