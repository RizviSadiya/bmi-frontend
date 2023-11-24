import { Route } from '@angular/router';

import { CanDeactivateApplicationsDetails } from 'app/modules/admin/apps/applications/applications.guards';
import { ApplicationsApplicationResolver, ApplicationsResolver } from 'app/modules/admin/apps/applications/applications.resolvers';
import { CampaignsChannelsResolver } from 'app/modules/admin/apps/campaigns/campaigns.resolvers';
import { ApplicationsComponent } from 'app/modules/admin/apps/applications/applications.component';
import { ApplicationsListComponent } from 'app/modules/admin/apps/applications/list/list.component';
import { ApplicationsDetailsComponent } from 'app/modules/admin/apps/applications/details/details.component';

export const applicationsRoutes: Route[] = [
    {
        path: '',
        component: ApplicationsComponent,
        children: [
            {
                path: '',
                component: ApplicationsListComponent,
                resolve: {
                    applications: ApplicationsResolver,
                    
                },

                children: [
                    {
                        path: ':id',
                        component: ApplicationsDetailsComponent,
                        resolve: {
                            application: ApplicationsApplicationResolver,
                            channels: CampaignsChannelsResolver
                        },
                // canDeactivate: [ApplicationsComponent],
                        
                        canDeactivate: [CanDeactivateApplicationsDetails]
                    }
                ]
            }
        ]
    },
   
];


