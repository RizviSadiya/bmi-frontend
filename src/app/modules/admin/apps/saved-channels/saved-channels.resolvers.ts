import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SavedChannelsService } from 'app/modules/admin/apps/saved-channels/saved-channels.service';
import { Channel } from 'app/layout/common/channel/all-channels.types';

@Injectable({
    providedIn: 'root'
})
export class SavedChannelsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _savedChannelsService: SavedChannelsService)
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
        let payload = {
            // "limit": this.pageSize,
            "page": '1',
            "perPage":  '10',
            "plateform_type":'1'

        }
        return this._savedChannelsService.getChannels(payload);
    }
}
