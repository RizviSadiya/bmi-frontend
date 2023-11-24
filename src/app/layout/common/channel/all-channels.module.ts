import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { AllChannelsComponent } from 'app/layout/common/channel/all-channels.component';
import { ChannelPricePopupComponent } from 'app/layout/common/channel-price-popup/channel-price-popup.component';
import { InfluencerChannelModule } from '../influencer-channel/influencer-channel.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AllInstaChannelsComponent } from './all-insta-channels/all-insta-channels.component';
@NgModule({
    declarations: [
        AllChannelsComponent,
        ChannelPricePopupComponent,
        AllInstaChannelsComponent
    ],
    imports     : [
        MatAutocompleteModule,
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
        MatSelectModule,
        MatSidenavModule,
        MatTooltipModule,
        InfluencerChannelModule,
        SharedModule,
        MatPaginatorModule
    ],
    exports     : [
        AllChannelsComponent,
        AllInstaChannelsComponent
    ]
})
export class AllChannelsModule
{
}
