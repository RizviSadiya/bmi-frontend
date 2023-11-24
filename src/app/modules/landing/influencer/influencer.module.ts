import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { SharedModule } from 'app/shared/shared.module';
import { LandingInfluencerComponent } from 'app/modules/landing/influencer/influencer.component';
import { landingInfluencerRoutes } from 'app/modules/landing/influencer/influencer.routing';
import { PublicChannelModule } from 'app/layout/common/public-channel/public-channel.module';
import { CarouselModule } from '../carousel/carousel.module';

@NgModule({
    declarations: [
        LandingInfluencerComponent
    ],
    imports     : [
        RouterModule.forChild(landingInfluencerRoutes),
        MatButtonModule,
        MatIconModule,
        MatTabsModule,
        MatExpansionModule,
        PublicChannelModule,
        CarouselModule,
        SharedModule
    ]
})
export class LandingInfluencerModule
{
}
