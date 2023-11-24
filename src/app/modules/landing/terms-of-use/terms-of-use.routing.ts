import { Route } from '@angular/router';
import { LandingTermsOfUseComponent } from 'app/modules/landing/terms-of-use/terms-of-use.component';

export const landingTermsRoutes: Route[] = [
    {
        path     : '',
        component: LandingTermsOfUseComponent
    }
];
