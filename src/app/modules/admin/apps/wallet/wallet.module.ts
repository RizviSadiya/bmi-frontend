import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { WalletHistoryComponent } from './history/history.component';
import { WalletHistoryListComponent } from './history/list/wallet-history.component';
import { WalletBillingComponent } from './billing/billing.component';
import { WalletBillingDetailsComponent } from './billing/details/billing-details.component';
import { walletRoutes } from 'app/modules/admin/apps/wallet/wallet.routing';

@NgModule({
    declarations: [
        WalletHistoryComponent,
        WalletHistoryListComponent,
        WalletBillingComponent,
        WalletBillingDetailsComponent
    ],
    imports     : [
        RouterModule.forChild(walletRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSortModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTooltipModule,
        SharedModule
    ]
})
export class WalletModule
{
}
