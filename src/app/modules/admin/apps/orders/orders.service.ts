import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';

import { Order } from 'app/modules/admin/apps/orders/orders.types';
import { UserService } from 'app/core/user/user.service';
import { environment } from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrdersService {
    // Private
    private _order: BehaviorSubject<Order | null> = new BehaviorSubject(null);
    private _orders: BehaviorSubject<Order[] | null> = new BehaviorSubject(null);
    private _totalOrders: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _liveOrders: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _paginationCount: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _cancelledOrders: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _completedOrders: BehaviorSubject<number | 0> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(
        private _userService: UserService,
        private _httpClient: HttpClient
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for application
     */
    get order$(): Observable<Order> {
        return this._order.asObservable();
    }

    /**
     * Getter for contacts
     */
    get orders$(): Observable<Order[]> {
        return this._orders.asObservable();
    }

    get totalOrdersCount$(): Observable<number> {
        return this._totalOrders.asObservable();
    }

    get liveOrdersCount$(): Observable<number> {
        return this._liveOrders.asObservable();
    }
    get totalpaginationCount$(): Observable<number> {
        return this._paginationCount.asObservable();
    }

    get completedOrdersCount$(): Observable<number> {
        return this._completedOrders.asObservable();
    }

    get cancelledOrdersCount$(): Observable<number> {
        return this._cancelledOrders.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get applications
     */
    getOrders(payload?): Observable<Order[]> {
        let pendingPayload = {
            // "limit": "",
            // "offset": ""
            "page":'1',
            "perPage":'10',
            "status": '0',
            "plateform_type":1

        }
        let payloadData = payload ? payload : pendingPayload;
        return this._httpClient.post<Order[]>(`${environment.API_BASE_ENDPOINT + environment.INFLUENCER_URL}live-orders`, payloadData).pipe(
            tap((orders) => {
                if (orders["success"]) {
                    this._orders.next(orders["payload"].orders);
                    this._totalOrders.next(orders["payload"].totalCount);
                    this._liveOrders.next(orders["payload"].liveCount);
                    this._paginationCount.next(orders["payload"].total);
                    this._completedOrders.next(orders["payload"].completedCount);
                    this._cancelledOrders.next(orders["payload"].cancelledCount);
                } else {
                    this._orders.next(null);
                    this._totalOrders.next(null);
                    this._liveOrders.next(null);
                    this._paginationCount.next(null);
                    this._completedOrders.next(null);
                    this._cancelledOrders.next(null);
                }
            })
        );
    }

    /**
     * Get application by id
     */
    getOrderById(id: string): Observable<Order> {
        let user_url = this._userService.userDetails.userType.toLowerCase() === "brand"
            ? environment.BRAND_URL : environment.INFLUENCER_URL;
        let payload = { "order_id": id };
        return this._httpClient.post<Order[]>(`${environment.API_BASE_ENDPOINT + user_url}view-order`, payload).pipe(
            take(1),
            tap((response: any) => {
                if (response.success) {
                    this._order.next(response["payload"]);
                    return response["payload"];
                } else {
                    return throwError('Could not found order with id of ' + id + '!');
                }
            })
        );
    }

    cancelOrder(order_id: any): Observable<any> {
        let payload = {
            "order_id": order_id
        }
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.INFLUENCER_URL}cancel-order`, payload);
    }

    orderProcess(payload: any) {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}order-process`, payload);
    }

    order_invoice_download(payload: any) {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}download-invoice`, payload);
    }

    raiseDispute(payload: any) {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}raise-dispute`, payload);
    }

    deadlinIncrease(payload: any) {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.INFLUENCER_URL}increase-deadline`, payload);
    }

    payRemainingOrderAmount(payload: any) {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}pay-remaining-order-amount`, payload);
    }

}
