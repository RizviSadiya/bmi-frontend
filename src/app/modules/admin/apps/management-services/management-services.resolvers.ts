import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';

import { ManagementServiceService } from 'app/modules/admin/apps/management-services/management-services.service';
import { Management } from 'app/modules/admin/apps/management-services/management-services.types';

@Injectable({
    providedIn: 'root'
})
export class ManagementServicesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _managementService: ManagementServiceService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Management>
    {
        return this._managementService.getServiceManagement();
    }
}
