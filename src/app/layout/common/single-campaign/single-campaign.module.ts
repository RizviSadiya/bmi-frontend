import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { singleCampaignComponent } from 'app/layout/common/single-campaign/single-campaign.component';
import { OrderProgressBarModule } from 'app/layout/common/order-progress-bar/order-progress-bar.module';
import { InviteCampaignPopupComponent } from '../invite-campaign-popup/invite-campaign-popup.component';
import { SharedModule } from 'app/shared/shared.module';
import { PipesModule } from 'app/core/pipes/pipes.module';
import { MoreLessTextModule } from 'app/layout/common/more-less-text/more-less-text.module';
import { InfluencerProposalListComponent } from './influencer-proposal-list/influencer-proposal-list.component';
import { InstagramCampaignComponent } from './instagram-campaign/instagram-campaign.component';

@NgModule({
    declarations: [
        singleCampaignComponent,
        InviteCampaignPopupComponent,
        InfluencerProposalListComponent,
        InstagramCampaignComponent
    ],
    imports: [
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,
        MatInputModule,
        MatSelectModule,
        MatDialogModule,
        RouterModule,
        OrderProgressBarModule,
        PipesModule,
        MoreLessTextModule,
        SharedModule
    ],
    exports: [
        singleCampaignComponent,
        InfluencerProposalListComponent,
        InstagramCampaignComponent
    ]
})
export class SingleCampaignModule {
}
