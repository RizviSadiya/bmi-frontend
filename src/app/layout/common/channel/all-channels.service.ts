import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { Channel } from 'app/layout/common/channel/all-channels.types';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ChannelService {
    // Private
    private _channels: BehaviorSubject<Channel[] | null> = new BehaviorSubject(null);
    private _totalChannelCount: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _totalInstaChannelCount: BehaviorSubject<number | 0> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for tags
     */
     get channelCount$(): Observable<number> {
        return this._totalChannelCount.asObservable();
    }

    //  get instaChannelCount$(): Observable<number> {
    //     return this._totalInstaChannelCount.asObservable();
    // }

    get channels$(): Observable<Channel[]> {
        return this._channels.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get channels
     */
    getChannels(payload?): Observable<Channel[]> {
        return this._httpClient.post<Channel[]>(`${environment.API_BASE_ENDPOINT + environment.INFLUENCER_URL}channel-list`, payload).pipe(
            tap((response: any) => {
                if(response['success']){
                    this._channels.next(response.payload.channel_list);
                    this._totalChannelCount.next(response.payload.totalCount);
                    // this._totalInstaChannelCount.next(response.payload.total);
                }else{
                    this._totalChannelCount.next(null);
                    // this._totalInstaChannelCount.next(null);
                }
              
            }),
            shareReplay(),
        );
    }

    /**
     * Crate channel
     *
     * @param channel
     */
    createChannel(channel: Channel): Observable<Channel> {
        return this.channels$.pipe(
            take(1),
            switchMap(channels => this._httpClient.post<Channel>('api/apps/tasks/tag', { channel }).pipe(
                map((newChannel) => {

                    // Update the tags with the new tag
                    this._channels.next([...channels, newChannel]);

                    // Return new tag from observable
                    return newChannel;
                })
            ))
        );
    }

}
