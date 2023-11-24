import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Affiliate } from 'app/modules/admin/apps/affiliate-program/affiliate-program.types';
import { environment } from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AffiliateProgramService
{
    // Private
    private _affiliate: BehaviorSubject<Affiliate | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for affiliate
     */
    get affiliate$(): Observable<Affiliate>
    {
        return this._affiliate.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    getServiceManagement(): Observable<any> {
        return this._httpClient.get<any>(`${environment.API_BASE_ENDPOINT + environment.INFLUENCER_URL}service-management`).pipe(
            tap((response: any) => {
                if (response.success) {
                    this._affiliate.next(response.payload.is_managment_service);
                } else {
                    this._affiliate.next(null);
                }
            })
        );
    }

    optAffiliateProgram() {
        let payload = {
            "is_affiliate_program": 1
        };
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.INFLUENCER_URL}affiliate_program`, payload);
    }
    
}
