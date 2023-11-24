import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { SharedModule } from 'app/shared/shared.module';
import { LandingBrandComponent } from 'app/modules/landing/brand/brand.component';
import { landingBrandRoutes } from 'app/modules/landing/brand/brand.routing';
import { PublicChannelModule } from 'app/layout/common/public-channel/public-channel.module';
import { CarouselModule } from '../carousel/carousel.module';
@NgModule({
    declarations: [
        LandingBrandComponent
    ],
    imports     : [
        RouterModule.forChild(landingBrandRoutes),
        MatButtonModule,
        MatIconModule,
        MatTabsModule,
        MatExpansionModule,
        PublicChannelModule,
        CarouselModule,
        SharedModule
    ]
})
export class LandingBrandModule
{
}
