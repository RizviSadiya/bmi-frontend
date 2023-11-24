import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { InfluencerChannelComponent } from 'app/layout/common/influencer-channel/influencer-channel.component';
import { InviteInfluencerPopupComponent } from '../invite-influencer-popup/invite-influencer-popup.component';
import { SharedModule } from 'app/shared/shared.module';
import { PipesModule } from 'app/core/pipes/pipes.module';
import { ViewProposalComponent } from './view-proposal/view-proposal.component';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { InfluencerProposalComponent } from './influencer-proposal/influencer-proposal.component';
import { InstaChannelListComponent } from './insta-channel-list/insta-channel-list.component';
import { InfluencerInstaProposalComponent } from './influencer-insta-proposal/influencer-insta-proposal.component';

@NgModule({
    declarations: [
        InfluencerChannelComponent,
        InviteInfluencerPopupComponent,
        ViewProposalComponent,
        InfluencerProposalComponent,
        InstaChannelListComponent,
        InfluencerInstaProposalComponent,
    ],
    imports: [
        FilterPipeModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,
        MatSelectModule,
        MatDialogModule,
        RouterModule,
        PipesModule,
        SharedModule
    ],
    exports: [
        InfluencerChannelComponent,
        InfluencerProposalComponent,
        InstaChannelListComponent,
        InfluencerInstaProposalComponent
    ]
})
export class InfluencerChannelModule {
}
