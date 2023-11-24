import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { shareReplay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class InfluencerChannelService {

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    planType:any
    setPlantype(x){
        this.planType=x
    }

    getPlantype(){
        return this.planType
    }

    updateChannel(payload): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.INFLUENCER_URL}edit-channel`, payload);
    }

    deleteChannel(payload): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.INFLUENCER_URL}delete-channel`, payload);
    }

    revealChannel(payload): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}revealedchannels`, payload);
    }

    likeChannel(payload: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}like`, payload);
    }

    dislikeChannel(payload: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}unlike`, payload);
    }

    dontShowMeAgain(payload: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}dont_show_me_again`, payload);
    }
}
