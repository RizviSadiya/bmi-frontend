import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Management } from 'app/modules/admin/apps/management-services/management-services.types';
import { environment } from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ManagementServiceService {
    // Private
    private _management: BehaviorSubject<Management | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
        this.getServiceManagement();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for management
     */
    get management$(): Observable<Management> {
        return this._management.asObservable();
    }

    getServiceManagement(): Observable<any> {
        return this._httpClient.get<any>(`${environment.API_BASE_ENDPOINT + environment.INFLUENCER_URL}service-management`).pipe(
            tap((response: any) => {
                if (response.success) {
                    this._management.next(response.payload.is_managment_service);
                } else {
                    this._management.next(null);
                }
            })
        );
    }

    optManagementService() {
        let payload = {
            "is_managment_service": 1
        };
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.INFLUENCER_URL}managment-service`, payload);
    }

}
