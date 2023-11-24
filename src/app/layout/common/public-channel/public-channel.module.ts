import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { PublicChannelComponent } from 'app/layout/common/public-channel/public-channel.component';
import { SharedModule } from 'app/shared/shared.module';
import { PipesModule } from 'app/core/pipes/pipes.module';

@NgModule({
    declarations: [
        PublicChannelComponent
    ],
    imports: [
        MatIconModule,
        MatTooltipModule,
        RouterModule,
        PipesModule,
        SharedModule
    ],
    exports: [
        PublicChannelComponent
    ]
})
export class PublicChannelModule {
}
