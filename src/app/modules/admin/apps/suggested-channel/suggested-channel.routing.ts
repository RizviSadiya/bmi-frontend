import { Route } from '@angular/router';

import { RevealedChannelsResolver } from 'app/modules/admin/apps/revealed-channels/revealed-channels.resolvers';

import { SuggestedChannelComponent } from './suggested-channel.component';
import { SuggestedChannelsResolver } from './suggested-channel.resolvers';

export const SuggestedChannelsRoutes: Route[] = [
    {
        path     : '',
        component: SuggestedChannelComponent,
        resolve      : {
            task     : SuggestedChannelsResolver
            
        },
    }
];
