import { Route } from '@angular/router';

import { CanDeactivateCampaignsDetails } from 'app/modules/admin/apps/campaigns/campaigns.guards';
import { PendingChangesGuard } from 'app/modules/admin/apps/campaigns/pending-changes.guard';
import { CampaignsCampaignResolver, CampaignsResolver, CampaignsChannelsResolver, CampaignResponseResolver } from 'app/modules/admin/apps/campaigns/campaigns.resolvers';
import { CampaignsComponent } from 'app/modules/admin/apps/campaigns/campaigns.component';
import { CampaignsListComponent } from 'app/modules/admin/apps/campaigns/list/list.component';
import { CampaignsDetailsComponent } from 'app/modules/admin/apps/campaigns/details/details.component';
import { CampaignsPostComponent } from 'app/modules/admin/apps/campaigns/post/post.component';
import { CampaignResponsesComponent } from 'app/modules/admin/apps/campaigns/responses/responses.component';
import { PreviewCampaignComponent } from './preview-campaign/preview-campaign.component';

export const campaignsRoutes: Route[] = [
    {
        path: '',
        component: CampaignsComponent,
        children: [
            {
                path: 'all',
                component: CampaignsListComponent,
                resolve: {
                    campaigns: CampaignsResolver
                },
                children: [
                    {
                        path: ':id',
                        component: CampaignsDetailsComponent,
                        resolve: {
                            campaign: CampaignsCampaignResolver,
                            channels: CampaignsChannelsResolver
                        },
                        canDeactivate: [CanDeactivateCampaignsDetails]
                    }
                ]
            }
        ]
    },
    {
        path: 'post',
        component: CampaignsPostComponent,
        resolve: {
            campaigns: CampaignsResolver
        },
        canDeactivate: [PendingChangesGuard],
        children: [
            {
                path: ':id',
                component: CampaignsPostComponent,
                resolve: {
                    campaign: CampaignsCampaignResolver
                },
                // canDeactivate: [PendingChangesGuard]
            }
        ]
    },
    {
        path: 'responses',
        component: CampaignResponsesComponent,
        children: [
            {
                path: ':id',
                component: CampaignResponsesComponent,
                resolve: {
                    response: CampaignResponseResolver
                }
            }
        ]
    },
    {
        path: 'preview',
        component: PreviewCampaignComponent,
        // children: [
        //     {
        //         path: ':id',
        //         component: CampaignResponsesComponent,
        //         resolve: {
        //             response: CampaignResponseResolver
        //         }
        //     }
        // ]
    }
];
