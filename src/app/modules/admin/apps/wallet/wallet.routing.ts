import { Route } from '@angular/router';
import { WalletHistoryComponent } from 'app/modules/admin/apps/wallet/history/history.component';
import { WalletHistoryListComponent } from 'app/modules/admin/apps/wallet/history/list/wallet-history.component';
import { WalletBillingComponent } from 'app/modules/admin/apps/wallet/billing/billing.component';
import { WalletBillingDetailsComponent } from 'app/modules/admin/apps/wallet/billing/details/billing-details.component';

export const walletRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'history'
    },
    {
        path     : 'history',
        component: WalletHistoryComponent,
        children : [
            {
                path     : '',
                component: WalletHistoryListComponent
            }
        ]
    },
    {
        path     : 'credits',
        component: WalletBillingComponent,
        children : [
            {
                path     : '',
                component: WalletBillingDetailsComponent
            }
        ]
    }
];
