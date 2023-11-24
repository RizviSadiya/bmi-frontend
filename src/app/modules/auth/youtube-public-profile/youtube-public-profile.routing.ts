import { Route } from '@angular/router';
import { YoutubePublicProfileComponent } from './youtube-public-profile.component';
export const youtubepublicprofileRoutes: Route[] = [
    {
        path     : '',
        component: YoutubePublicProfileComponent,
        children : [
            {
                path         : ':channel/:uuid',
                component    : YoutubePublicProfileComponent
            }
        ]
    }
];
