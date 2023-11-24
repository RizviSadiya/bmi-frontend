import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApplicationsService } from 'app/modules/admin/apps/applications/applications.service';
import { Application } from 'app/modules/admin/apps/applications/applications.types';

@Injectable({
    providedIn: 'root'
})
export class ApplicationsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _applicationsService: ApplicationsService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Application[]>
    {
        let payload={
            "page":'1',
            "perPage":'10',
            "status":'',
            'plateform_type':'1'
        }
        return this._applicationsService.getApplications(payload);
    }
}

@Injectable({
    providedIn: 'root'
})
export class ApplicationsApplicationResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _applicationsService: ApplicationsService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Application>
    {
        return this._applicationsService.getApplicationById(route.paramMap.get('id'))
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


@Injectable({
    providedIn: 'root'
})
export class ApplicationsListResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _applicationsService: ApplicationsService, private _router:Router)
    {
    }
    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._applicationsService.getApplicationById(route.paramMap.get('id'))
        .pipe(
            catchError((error) => {
                this._router.navigateByUrl('/apps/campaigns/all');
                return throwError(error);
            })
        );
    
    }
 
}


