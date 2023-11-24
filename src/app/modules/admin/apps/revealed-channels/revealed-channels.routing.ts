import { Route } from '@angular/router';
import { RevealedChannelsComponent } from 'app/modules/admin/apps/revealed-channels/revealed-channels.component';
import { RevealedChannelsResolver } from 'app/modules/admin/apps/revealed-channels/revealed-channels.resolvers';

export const revealedChannelsRoutes: Route[] = [
    {
        path     : '',
        component: RevealedChannelsComponent,
        resolve      : {
            channels     : RevealedChannelsResolver
        },
    }
];
