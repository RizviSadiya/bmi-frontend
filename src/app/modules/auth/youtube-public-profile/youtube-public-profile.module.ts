import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { BmiCardModule } from '@bmi/components/card';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { SharedModule } from 'app/shared/shared.module';

import { YoutubePublicProfileComponent } from './youtube-public-profile.component';
import { youtubepublicprofileRoutes } from './youtube-public-profile.routing';

import { ComingSoonModule } from 'app/layout/common/coming-soon/coming-soon.module';
import { PipesModule } from 'app/core/pipes/pipes.module';
import { MoreLessTextModule } from 'app/layout/common/more-less-text/more-less-text.module';

@NgModule({
    declarations: [
        YoutubePublicProfileComponent
    ],
    imports     : [
        RouterModule.forChild(youtubepublicprofileRoutes),
        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatTooltipModule,
        MatTableModule,
        BmiCardModule,
        ComingSoonModule,
        PipesModule,
        MoreLessTextModule,
        ShareButtonsModule,
        ShareIconsModule,
        SharedModule
    ]
})
export class YoutubePublicProfileModule
{
}
