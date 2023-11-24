import { Route } from '@angular/router';
import { SavedChannelsComponent } from 'app/modules/admin/apps/saved-channels/saved-channels.component';
import { SavedChannelsResolver } from 'app/modules/admin/apps/saved-channels/saved-channels.resolvers';

export const savedChannelsRoutes: Route[] = [
    {
        path     : '',
        component: SavedChannelsComponent,
        resolve      : {
            channels     : SavedChannelsResolver
        },
    }
];
