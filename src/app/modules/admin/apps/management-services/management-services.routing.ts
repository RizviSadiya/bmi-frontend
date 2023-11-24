import { Route } from '@angular/router';
import { ManagementServicesComponent } from 'app/modules/admin/apps/management-services/management-services.component';
import { ManagementServicesResolver } from 'app/modules/admin/apps/management-services/management-services.resolvers';

export const managementProgramRoutes: Route[] = [
    {
        path     : '',
        component: ManagementServicesComponent,
        resolve: {
            management: ManagementServicesResolver
        },
    }
];
