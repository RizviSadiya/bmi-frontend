import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { OrdersDetailsComponent } from 'app/modules/admin/apps/orders/details/details.component';

@Injectable({
    providedIn: 'root'
})
export class CanDeactivateOrdersDetails implements CanDeactivate<OrdersDetailsComponent>
{
    canDeactivate(
        component: OrdersDetailsComponent,
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

        // If the next state doesn't contain '/orders'
        // it means we are navigating away from the
        // orders app
        if ( !nextState.url.includes('/orders') )
        {
            // Let it navigate
            return true;
        }

        // If we are navigating to another orders...
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
