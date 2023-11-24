import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';

import { AffiliateProgramService } from 'app/modules/admin/apps/affiliate-program/affiliate-program.service';
import { Affiliate } from 'app/modules/admin/apps/affiliate-program/affiliate-program.types';

@Injectable({
    providedIn: 'root'
})
export class AffiliateProgramResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _affiliateService: AffiliateProgramService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Affiliate>
    {
        return this._affiliateService.getServiceManagement();
    }
}
