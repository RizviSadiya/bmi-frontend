import { Route } from '@angular/router';
import { ChannelListResolver } from 'app/modules/admin/apps/add-channel/add-channel.resolvers';
import { AddChannelComponent } from 'app/modules/admin/apps/add-channel/add-channel.component';

export const addChannelRoutes: Route[] = [
    {
        path     : '',
        component: AddChannelComponent,
        // resolve  : {
        //     data: ChannelListResolver
        // }
    }
];
