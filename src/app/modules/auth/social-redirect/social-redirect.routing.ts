import { Route } from '@angular/router';
import { SocialRedirectComponent } from 'app/modules/auth/social-redirect/social-redirect.component';

export const socialRedirectRoutes: Route[] = [
    {
        path: '',
        // component: SocialRedirectComponent,
        children: [
            {
                path: 'google',
                component: SocialRedirectComponent,
            }
        ]
    }
];
