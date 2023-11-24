import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Navigation } from 'app/core/navigation/navigation.types';
import { environment } from '../../../environments/environment';
import { Application } from 'app/modules/admin/apps/applications/applications.types';

@Injectable({
    providedIn: 'root'
})
export class NavigationService
{
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    private _channelRevealed: BehaviorSubject<boolean | false> = new BehaviorSubject(null);
    private _application: BehaviorSubject<Application | null> = new BehaviorSubject(null);
    private _applications: BehaviorSubject<Application[] | null> = new BehaviorSubject(null);
    private _totalApplications: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _pendingApplications: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _rejectedApplications: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _completedApplications: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _shortlistedApplications: BehaviorSubject<number | 0> = new BehaviorSubject(null);

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
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation>
    {
        return this._navigation.asObservable();
    }

    get channelRevealed$(): Observable<boolean>
    {
        return this._channelRevealed.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

      /**
     * Getter for application
     */
       get application$(): Observable<Application> {
        return this._application.asObservable();
    }

    /**
     * Getter for contacts
     */
    get applications$(): Observable<Application[]> {
        return this._applications.asObservable();
    }

    get totalApplications$(): Observable<number> {
        return this._totalApplications.asObservable();
    }

    get pendingApplications$(): Observable<number> {
        return this._pendingApplications.asObservable();
    }

    get rejectedApplications$(): Observable<number> {
        return this._rejectedApplications.asObservable();
    }

    get completedApplications$(): Observable<number> {
        return this._completedApplications.asObservable();
    }

    get ShortlistedApplications$(): Observable<number> {
        return this._shortlistedApplications.asObservable();
    }

    get data$(): Observable<any>
    {
        return this._data.asObservable();
    }


    /**
     * Get all navigation data
     */
    get(): Observable<Navigation>
    {
        return this._httpClient.get<Navigation>('api/common/navigation').pipe(
            tap((navigation) => {
                this._navigation.next(navigation);
            })
        );
    }
URL:any
plan:any
set_url(x){
    this.URL=x
}

get_url(){
    return this.URL
}

    getMenucount(): Observable<any> {
        return this._httpClient.get<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}menu-count`).pipe(
            tap((response: any) => {
                this._data.next(response);
              
                
              
               sessionStorage.setItem("planDetail",JSON.stringify(response.payload.plan) )
               sessionStorage.setItem("website",JSON.stringify(response.payload.websiteSetting
                ) )
          
               let url= response.payload.user_type
              this.set_url(url)
                console.log("url",url);
               
                
            })
        );
        
    }

    getApplications(payload?): Observable<Application[]> {
        payload={
            "page":'1',
            "perPage":'10'
        }
        return this._httpClient.post<Application[]>(`${environment.API_BASE_ENDPOINT + environment.INFLUENCER_URL}get-application`, payload).pipe(
            tap((applications:any) => {
              
            })
        );
    }

    updateLeftMenuItem(bool: boolean) {
        this._channelRevealed.next(bool);
    }
}
