import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WalletBillingService {
    // Private
    private _pagination: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _billings: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<any> {
        return this._pagination.asObservable();
    }

    get billings$(): Observable<any[]> {
        return this._billings.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get products
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getBillingsData(type: number = 1, page: number = 1, size: number = 10, sort: string = 'name', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<{ payload: any; transactions: any[] }> {
        return this._httpClient.get<{ payload: any; transactions: any[] }>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}transaction-history`, {
            params: {
                page: '' + page,
                perPage: '' + size,
                type: '' + type,
                sort,
                order,
                search
            }
        }).pipe(
            tap((response) => {
                this._pagination.next(response.payload);
                this._billings.next(response.payload.data);
            })
        );
    }

}
