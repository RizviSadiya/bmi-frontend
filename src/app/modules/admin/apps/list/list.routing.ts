import { Route } from '@angular/router';
import { ListComponent } from 'app/modules/admin/apps/list/list.component';
import { ListResolver } from 'app/modules/admin/apps/list/list.resolvers';
import { ViewListDetailComponent } from './view-list-detail/view-list-detail.component';

export const listRoutes: Route[] = [
    {
        path     : '',
        component: ListComponent,
        resolve      : {
            lists     : ListResolver
        },
    },
    {
        path     : 'list-view',
        component: ViewListDetailComponent,
        // resolve      : {
        //     lists     : ListResolver
        // },
    },

];
