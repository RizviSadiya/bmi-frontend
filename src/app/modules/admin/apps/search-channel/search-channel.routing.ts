import { Route } from '@angular/router';
import { SearchChannelComponent } from './search-channel.component';

export const searchChannelRoutes: Route[] = [
    {
        path: '',
        component: SearchChannelComponent,
        children : [
            {
                path         : ':searchString',
                component    : SearchChannelComponent
            }
        ]
    }
];
