import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WalletService {
    private _amountPaid: BehaviorSubject<boolean | false> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }
    
    setAmountPaid$(value: boolean) {
        this._amountPaid.next(value);
    }

    get amountPaid$(): Observable<boolean> {
        return this._amountPaid.asObservable();
    }

    payOrderAmount(payload: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}pay-order-amount`, payload);
    }
    
    payHireAmount(payload: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}order-payment`, payload);
    }

    saveOrderTransaction(payload: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}save-order-transaction`, payload);
    }

    addEwalletMoney(payload: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}add-money-to-wallet`, payload);
    }

    storeTransactionDetails(payload: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}save-transaction`, payload);
    }

    saveHireTransactionDetails(payload: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}save-order-payment`, payload);
    }

    subscribeTopup(payload: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}subscription/topup`, payload);
    }

    storeTopupResponse(payload: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}subscription/topupresponse`, payload);
    }
}
