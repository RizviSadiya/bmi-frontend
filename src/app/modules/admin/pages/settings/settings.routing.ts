import { Route } from '@angular/router';
import { SettingsComponent } from 'app/modules/admin/pages/settings/settings.component';
import { SettingsProfileResolver } from './settings.resolvers';

export const settingsRoutes: Route[] = [
    {
        path     : '',
        component: SettingsComponent,
        resolve  : {
            userProfile   : SettingsProfileResolver
        },
    }
];
