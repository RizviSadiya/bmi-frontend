import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { OrdersService } from 'app/modules/admin/apps/orders/orders.service';
import { Order } from 'app/modules/admin/apps/orders/orders.types';

@Injectable({
    providedIn: 'root'
})
export class OrdersResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _ordersService: OrdersService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Order[]>
    {
        return this._ordersService.getOrders();
    }
}

@Injectable({
    providedIn: 'root'
})
export class OrdersOrderResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _ordersService: OrdersService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Order>
    {
        return this._ordersService.getOrderById(route.paramMap.get('id'))
                   .pipe(
                       // Error here means the requested contact is not available
                       catchError((error) => {

                           // Log the error
                           console.error(error);

                           // Get the parent url
                           const parentUrl = state.url.split('/').slice(0, -1).join('/');

                           // Navigate to there
                           this._router.navigateByUrl(parentUrl);

                           // Throw an error
                           return throwError(error);
                       })
                   );
    }
}
