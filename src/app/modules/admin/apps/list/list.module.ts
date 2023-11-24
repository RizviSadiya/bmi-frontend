import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
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
import { MatDialogModule } from '@angular/material/dialog';
import { BmiFindByKeyPipeModule } from '@bmi/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import { listRoutes } from 'app/modules/admin/apps/list/list.routing';
import { ListComponent } from 'app/modules/admin/apps/list/list.component';
import { ListDetailsComponent } from './details/details.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ViewListDetailComponent } from './view-list-detail/view-list-detail.component';
import { PipesModule } from 'app/core/pipes/pipes.module';
import { InfluencerChannelModule } from 'app/layout/common/influencer-channel/influencer-channel.module';

@NgModule({
    declarations: [
        ListComponent,
        ListDetailsComponent,
        ViewListDetailComponent
    ],
    imports: [
        RouterModule.forChild(listRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatMomentDateModule,
        MatProgressBarModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        PipesModule,
        MatSidenavModule,
        MatTableModule,
        MatTooltipModule,
        MatDialogModule,
        BmiFindByKeyPipeModule,
        SharedModule,
        InfluencerChannelModule
    ]
})
export class ListModule {
}
