import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { OrderListComponent } from 'app/layout/common/order-list/order-list.component';
import { OrderProgressBarModule } from 'app/layout/common/order-progress-bar/order-progress-bar.module';
import { SharedModule } from 'app/shared/shared.module';
import { MoreLessTextModule } from 'app/layout/common/more-less-text/more-less-text.module';

@NgModule({
    declarations: [
        OrderListComponent
    ],
    imports: [
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,
        RouterModule,
        OrderProgressBarModule,
        MoreLessTextModule,
        SharedModule
    ],
    exports: [
        OrderListComponent
    ]
})
export class OrderListModule {
}
