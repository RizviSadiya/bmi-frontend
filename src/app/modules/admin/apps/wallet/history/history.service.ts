import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WalletHistoryService
{
    // Private
    private _pagination: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _wallet: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _transactions: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient,
        private _userService: UserService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<any>
    {
        return this._pagination.asObservable();
    }

    get transactions$(): Observable<any[]>
    {
        return this._transactions.asObservable();
    }
    
    get wallet$(): Observable<any>
    {
        return this._wallet.asObservable();
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
    getWallets(type: number = 1, page: number = 1, size: number = 10, sort: string = 'name', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<{ payload: any; transactions: any[] }>
    {
        const userType = this._userService.userDetails.userType.toLowerCase();
        const endpoint = userType === "brand" ? 'transaction-history' : 'order-history';
        return this._httpClient.get<{ payload: any; transactions: any[] }>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL + endpoint}`, {
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
                this._transactions.next(response.payload.data);
            })
        );
    }
    
}
