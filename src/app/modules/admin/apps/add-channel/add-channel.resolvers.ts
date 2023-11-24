import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ChannelService } from 'app/layout/common/channel/all-channels.service';

@Injectable({
    providedIn: 'root'
})
export class ChannelListResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _channelService: ChannelService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._channelService.getChannels();
    }
}
