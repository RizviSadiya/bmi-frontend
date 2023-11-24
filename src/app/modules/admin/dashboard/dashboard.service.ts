import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from 'app/core/user/user.service';
import { environment } from '../../../../environments/environment';
import { user } from 'app/mock-api/common/user/data';

@Injectable({
    providedIn: 'root'
})
export class DashboardService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(
        private _userService: UserService,
        private _httpClient: HttpClient
        )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any>
    {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    getDashboardData(payload?): Observable<any> {
        let userType = this._userService.userDetails.userType.toLowerCase();
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}user-dashboard`, payload).pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }
    // getDashboardData(): Observable<any> {
    //     let userType = this._userService.userDetails.userType.toLowerCase();
    //     return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL + userType}/dashboard`, {}).pipe(
    //         tap((response: any) => {
    //             this._data.next(response);
    //         })
    //     );
    // }

    recommendedInfluencers(payload): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}recommended-influencers`, payload);
    }

    // updateInformation(payload): Observable<any> {
    //     return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.INFLUENCER_URL}update-profile`, payload);
    // }
    updateInfo(payload): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.INFLUENCER_URL}update-profile`, payload);
    }

    updateCategoryPreference(payload): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}update-category-preference`, payload);
    }

    verifyChannel(payload): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.INFLUENCER_URL}verify-channel`, payload);
    }

    getUserCreatedLists(payload?): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}manage-list`, payload);
    }

    createList(payload): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}create-list`, payload);
    }

    addChannelToList(payload): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}add-to-list`, payload);
    }
}
