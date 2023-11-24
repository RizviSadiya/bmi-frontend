import { Route } from '@angular/router';

import { CanDeactivateOrdersDetails } from 'app/modules/admin/apps/orders/orders.guards';
import { OrdersOrderResolver, OrdersResolver } from 'app/modules/admin/apps/orders/orders.resolvers';
import { OrdersComponent } from 'app/modules/admin/apps/orders/orders.component';
import { OrdersListComponent } from 'app/modules/admin/apps/orders/list/list.component';
import { OrdersDetailsComponent } from 'app/modules/admin/apps/orders/details/details.component';

export const ordersRoutes: Route[] = [
    {
        path     : '',
        component: OrdersComponent,
        children : [
            {
                path     : '',
                component: OrdersListComponent,
                resolve  : {
                    tasks    : OrdersResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : OrdersDetailsComponent,
                        resolve      : {
                            task     : OrdersOrderResolver
                        },
                        canDeactivate: [CanDeactivateOrdersDetails]
                    }
                ]
            }
        ]
    }
];
