import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BmiFindByKeyPipeModule } from '@bmi/pipes/find-by-key';
import { BmiAlertModule } from '@bmi/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { searchChannelRoutes } from 'app/modules/admin/apps/search-channel/search-channel.routing';
import { SearchChannelComponent } from './search-channel.component';
import { InfluencerChannelModule } from 'app/layout/common/influencer-channel/influencer-channel.module';
import { OutReachResultPopupComponent } from './out-reach-result-popup/out-reach-result-popup.component';

@NgModule({
    declarations: [
        SearchChannelComponent,
        OutReachResultPopupComponent
    ],
    imports     : [
        RouterModule.forChild(searchChannelRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatTableModule,
        MatTabsModule,
        MatTooltipModule,
        MatPaginatorModule,
        BmiFindByKeyPipeModule,
        BmiAlertModule,
        InfluencerChannelModule,
        SharedModule
    ]
})
export class SearchChannelModule
{
}
