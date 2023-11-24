import { Route } from '@angular/router';
import { SuggestedInstaInviteListComponent } from './suggested-insta-invite-list.component';
import { SuggestedInviteListRoutes } from '../suggested-invite-list/suggested-invite-list.routing';
import { SuggestedInstaInviteListResolver } from './suggested-insta-invite-list.resolvers'; 

export const  SuggestedInstaInviteListRoutes: Route[] = [
    {
        path     : '',
        component: SuggestedInstaInviteListComponent,
        resolve      : {
            task     : SuggestedInstaInviteListResolver
            
        },
    }
];
