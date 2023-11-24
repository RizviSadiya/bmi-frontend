import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PricingPlanService {

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    getPlanList(): Observable<any> {
        return this._httpClient.get<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}subscription/get`);
    }

    subscribeChannel(payload: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}subscription/subscribe`, payload);
    }

    storeSubscriptionResponse(payload: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}subscription/response`, payload);
    }

    currencyConvert(payload: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}currency-convert`, payload);
    }
}
