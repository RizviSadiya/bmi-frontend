import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { CampaignsDetailsComponent } from 'app/modules/admin/apps/campaigns/details/details.component';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class CanDeactivateCampaignsDetails implements CanDeactivate<CampaignsDetailsComponent>
{
    constructor(private login:AuthService,private router:Router)
    {
        let user = this.login.accessToken
        console.log("user",user);
        
    }
    canDeactivate(
        component: CampaignsDetailsComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
        // Get the next route
        let nextRoute: ActivatedRouteSnapshot = nextState.root;
        while ( nextRoute.firstChild )
        {
            nextRoute = nextRoute.firstChild;
        }

        // If the next state doesn't contain '/campaigns'
        // it means we are navigating away from the
        // campaigns app
        if ( !nextState.url.includes('/campaigns') || nextState.url.match('/apps/campaigns/post'))
        {
            // Let it navigate
            return true;
        }

        // If we are navigating to another campaign...
        if ( nextRoute.paramMap.get('id') )
        {
            // Just navigate
            return true;
        }
        // Otherwise...
        else
        {
            // Close the drawer first, and then navigate
            return component.closeDrawer().then(() => true);
        }
    }
}
