import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { RevealedChannelsService } from 'app/modules/admin/apps/revealed-channels/revealed-channels.service';
import { Channel } from 'app/layout/common/channel/all-channels.types';

@Injectable({
    providedIn: 'root'
})
export class RevealedChannelsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _revealedChannelsService: RevealedChannelsService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Channel[]>
    {
        return this._revealedChannelsService.getChannels();
    }
}
