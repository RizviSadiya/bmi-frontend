import { Route } from '@angular/router';
import { AffiliateProgramComponent } from 'app/modules/admin/apps/affiliate-program/affiliate-program.component';
import { AffiliateProgramResolver } from 'app/modules/admin/apps/affiliate-program/affiliate-program.resolvers';

export const affiliateProgramRoutes: Route[] = [
    {
        path     : '',
        component: AffiliateProgramComponent,
        resolve: {
            affiliate: AffiliateProgramResolver
        }
    }
];
