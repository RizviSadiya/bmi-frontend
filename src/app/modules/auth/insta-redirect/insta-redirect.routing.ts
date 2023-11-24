import { Route } from '@angular/router';
import { SocialRedirectComponent } from 'app/modules/auth/social-redirect/social-redirect.component';
import { InstaRedirectComponent } from './insta-redirect.component';

export const InstaRedirectRoutes: Route[] = [
    {
        path: '',
        // component: SocialRedirectComponent,
        children: [
            {
                path: 'callback',
                component: InstaRedirectComponent,
            }
        ]
    }
];
