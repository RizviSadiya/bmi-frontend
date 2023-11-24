import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CampaignsService } from 'app/modules/admin/apps/campaigns/campaigns.service';
import { Campaign } from 'app/modules/admin/apps/campaigns/campaigns.types';

@Injectable({
    providedIn: 'root'
})
export class CampaignsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _campaignsService: CampaignsService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Campaign[]>
    {
        return this._campaignsService.getCampaigns();
    }
}

@Injectable({
    providedIn: 'root'
})
export class CampaignsCampaignResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _campaignsService: CampaignsService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Campaign>
    {
        return this._campaignsService.getCampaignById(route.paramMap.get('id'))
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
export class CampaignsChannelsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _campaignsService: CampaignsService)
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
        return this._campaignsService.getChannels();
    }
}

@Injectable({
    providedIn: 'root'
})
export class CampaignResponseResolver implements Resolve<any>
{
    constructor(
        private _campaignsService: CampaignsService,
        private _router: Router
    ) {
        this.plateform_type=
        this._campaignsService.getPlateForm()
        
     }
    /**
     * Resolver
     *
     * @param route
     * @param state
     */
     plateform_type
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Campaign> {
      
        return this._campaignsService.getCampaignResponseById(route.paramMap.get('id'))
            .pipe(
                catchError((error) => {
                    this._router.navigateByUrl('/apps/campaigns/all');
                    return throwError(error);
                })
            );
    }
}