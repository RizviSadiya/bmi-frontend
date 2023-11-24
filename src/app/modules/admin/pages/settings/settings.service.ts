import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    private _profile: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    get profile$(): Observable<any> {
        return this._profile.asObservable();
    }

    getProfile(): Observable<any> {
        return this._httpClient.get<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}get-profile`).pipe(
            tap((response: any[]) => {
                this._profile.next(response['payload']);
            })
        );
    }

    getCountryList(): Observable<any> {
        return this._httpClient.get<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}get-country`);
    }

    changePassword(payload: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}change-password`, payload);
    }

    updateSettings(payload: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}profile-setting`, payload).pipe(
            tap((response: any) => {
                if(response.success) {
                    this._profile.next(response['payload']);
                }
            })
        );
    }
}
