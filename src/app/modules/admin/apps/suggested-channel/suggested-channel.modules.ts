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
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import * as moment from 'moment';
import { BmiFindByKeyPipeModule } from '@bmi/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import { revealedChannelsRoutes } from 'app/modules/admin/apps/revealed-channels/revealed-channels.routing';
// import { RevealedChannelsComponent } from 'app/modules/admin/apps/revealed-channels/revealed-channels.component';
// import { SuggestedInviteListComponent } from './suggested-invite-list.component';
import { InfluencerChannelModule } from 'app/layout/common/influencer-channel/influencer-channel.module';
// import { SuggestedChannelsRoutes } from './suggested-invite-list.routing';
// import { SuggestedChannelsResolver } from './suggested-invite-list.resolvers';
import { PipesModule } from 'app/core/pipes/pipes.module';
import { SuggestedChannelsRoutes } from './suggested-channel.routing';
import { SuggestedChannelComponent } from './suggested-channel.component';
import { SuggestedChannelsResolver } from  './suggested-channel.resolvers'
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
    declarations: [
        // RevealedChannelsComponent
        // SuggestedInviteListComponent
        SuggestedChannelComponent
    ],
    imports     : [
        RouterModule.forChild(SuggestedChannelsRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTabsModule,
        MatMenuModule,
        MatMomentDateModule,
        MatProgressBarModule,
        MatRadioModule,
        PipesModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatTableModule,
        MatTooltipModule,
        MatPaginatorModule,
        BmiFindByKeyPipeModule,
        InfluencerChannelModule,
        SharedModule,
        
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
export class SuggestedChannelModule
{
}
