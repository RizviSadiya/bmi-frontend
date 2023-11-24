import { Route } from '@angular/router';
import { EmailVerifiedComponent } from './email-verified.component';

export const emailVerifiedRoutes: Route[] = [
    {
        path: '',
        component: EmailVerifiedComponent,
        children : [
            {
                path         : ':id/:hash',
                component    : EmailVerifiedComponent
            }
            // {
            //     path         : ':id/:hash/:token',
            //     component    : EmailVerifiedComponent
            // }
        ]
    }
];
