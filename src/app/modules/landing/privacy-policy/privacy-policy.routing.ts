import { Route } from '@angular/router';
import { LandingPrivacyPolicyComponent } from 'app/modules/landing/privacy-policy/privacy-policy.component';

export const landingPrivacyPolicyRoutes: Route[] = [
    {
        path     : '',
        component: LandingPrivacyPolicyComponent,
        children:[
           { 
            path     : ':privacy-policy',
            component: LandingPrivacyPolicyComponent,
        }
        ]
    }
];
