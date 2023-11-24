import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ListService {
    // Private
    private _list: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _lists: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _totalLists: BehaviorSubject<number | 0> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for list
     */
    get list$(): Observable<any> {
        return this._list.asObservable();
    }

    /**
     * Getter for lists
     */
    get lists$(): Observable<any[]> {
        return this._lists.asObservable();
    }

    get totalLists$(): Observable<number>{
        return this._totalLists.asObservable();
    }

    
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get contacts
     */
     getLists(payload?): Observable<any[]>
     {
         return this._httpClient.post<any[]>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}manage-list`,payload).pipe(
             tap((response: any) => {
                 this._lists.next(response.payload['list']);
                 this._totalLists.next(response.payload.totalCount);
             }),
             shareReplay(),
         );
     }

     getViewListsDetails(payload?): Observable<any[]>
     {
         return this._httpClient.post<any[]>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}view-list`,payload)
     }
    //  getLists(): Observable<any[]>
    //  {
    //      return this._httpClient.get<any[]>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}manage-list`).pipe(
    //          tap((response: any) => {
    //              this._lists.next(response.payload['list']);
    //              this._totalLists.next(response.payload['list'].length);
    //          }),
    //          shareReplay(),
    //      );
    //  }

     getOutReachData(payload): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}channel-list-add`, payload);
    }

    addOutReachData(payload): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}add-profile-to-list`, payload);
    }
     createList(payload): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}create-list`, payload);
    }

     updateList(payload) {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}edit-list`, payload);
     }

     deleteList(payload) {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}delete-list`, payload);
     }


}
