import { Route } from '@angular/router';
import { SuggestedInviteListComponent } from './suggested-invite-list.component';
import { RevealedChannelsResolver } from 'app/modules/admin/apps/revealed-channels/revealed-channels.resolvers';
import {  SuggestedInviteListResolver } from './suggested-invite-list.resolvers';

export const SuggestedInviteListRoutes: Route[] = [
    {
        path     : '',
        component: SuggestedInviteListComponent,
        resolve      : {
            task     : SuggestedInviteListResolver
            
        },
    }
];
