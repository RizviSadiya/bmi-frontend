import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Channel } from 'app/modules/admin/apps/add-channel/add-channel.types';
import { environment } from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RevealedChannelsService {
    // Private
    private _channel: BehaviorSubject<Channel | null> = new BehaviorSubject(null);
    private _channels: BehaviorSubject<Channel[] | null> = new BehaviorSubject(null);
    private _totalChannels: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _totalsuggestedChannels: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for channel
     */
    get channel$(): Observable<Channel> {
        return this._channel.asObservable();
    }

    /**
     * Getter for contacts
     */
    get channels$(): Observable<Channel[]> {
        return this._channels.asObservable();
    }

    get totalChannels$(): Observable<number>{
        return this._totalChannels.asObservable();
    }

    get suggestedtotalChannels$(): Observable<number>{
        return this._totalsuggestedChannels.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get contacts
     */
     getChannels(body?): Observable<Channel[]>
     {
        let payload = {
            "page": "1",
            "perPage": "10",
            "plateform_type":'1'
        };
         return this._httpClient.post<Channel[]>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}revealed-channel-list`, body ? body : payload).pipe(
             tap((response: any) => {
                 this._channels.next(response.payload['revealedchannels']);
                 this._totalChannels.next(response.payload['totalCount']);
                //  this._totalsuggestedChannels.next(0);
             })
         );
     }
     getshowSimilarChannels(body?): Observable<Channel[]>
     {
        let payload={
            "search_keyword":''
    }
         return this._httpClient.post<Channel[]>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}show-similar`, body ? body : payload).pipe(
             tap((response: any) => {
                 this._channels.next(response.payload['channel_list']);
                 this._totalsuggestedChannels.next(0);
                 this._totalsuggestedChannels.next(response.payload['totalCount']);
             })
         );
     }
}
