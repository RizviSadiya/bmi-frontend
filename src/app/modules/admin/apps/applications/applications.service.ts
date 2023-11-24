import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, shareReplay, switchMap, take, tap } from 'rxjs/operators';

import { Application } from 'app/modules/admin/apps/applications/applications.types';
import { environment } from '../../../../../environments/environment';
import { Channel } from 'app/layout/common/channel/all-channels.types';

@Injectable({
    providedIn: 'root'
})
export class ApplicationsService {
    // Private
    private _application: BehaviorSubject<Application | null> = new BehaviorSubject(null);
    private _applications: BehaviorSubject<Application[] | null> = new BehaviorSubject(null);
    private _totalApplications: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _pendingApplications: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _rejectedApplications: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _completedApplications: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _shortlistedApplications: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _channels: BehaviorSubject<Channel[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get applications
     */
    getApplications(payload): Observable<Application[]> {
    //    payload = {
    //         // "limit": this.pageSize,
    //         "page":  '',
    //         "perPage":  '10'

    //     }
        return this._httpClient.post<Application[]>(`${environment.API_BASE_ENDPOINT + environment.INFLUENCER_URL}get-application`, payload).pipe(
            tap((applications) => {
                if (applications["success"]) {
                    this._applications.next(applications["payload"].applications);
                    this._totalApplications.next(applications["payload"].totalCount);
                    this._pendingApplications.next(applications["payload"].pendingCount);
                    this._rejectedApplications.next(applications["payload"].rejectedCount);
                    this._completedApplications.next(applications["payload"].completedCount);
                    this._shortlistedApplications.next(applications["payload"].shortlistCount);
                } else {
                    this._applications.next(null);
                    this._totalApplications.next(null);
                    this._pendingApplications.next(null);
                    this._rejectedApplications.next(null);
                    this._completedApplications.next(null);
                    this._shortlistedApplications.next(null);
                }
            }),
            shareReplay()
        );
    }

    /**
     * Search applications with given query
     *
     * @param query
     */
    searchApplications(query: string): Observable<Application[]> {
        return this._httpClient.get<Application[]>('api/apps/contacts/search', {
            params: { query }
        }).pipe(
            tap((applications) => {
                this._applications.next(applications);
            })
        );
    }

    /**
     * Get application by id
     */
     plateform_type:any
    setPlateform(x){
this.plateform_type=x
        console.log("x",this.plateform_type);
        
    }

    getPlateform(){
       return this.plateform_type 
    }

    // getChannels(): Observable<Channel[]> {
    //     let payload={
    //         "page":1,
    //         "perPage":10,
    //         "plateform_type":
    //     }
    //     return this._httpClient.post<Channel[]>(`${environment.API_BASE_ENDPOINT + environment.INFLUENCER_URL}channel-list`,payload).pipe(
    //         shareReplay(1),
    //         tap((response: any) => {
    //             this._channels.next(response.payload.channel_list);
    //         })
            
    //     );
    // }

    getApplicationById(id: string): Observable<Application> {
        let payload = { "id": id ,
        "plateform_type":this.plateform_type?.plateform_type
    };
        return this._httpClient.post<Application[]>(`${environment.API_BASE_ENDPOINT + environment.INFLUENCER_URL}view-application`, payload).pipe(
            take(1),
            shareReplay(),
            tap((response: any) => {
                if (response.success) {
                    this._application.next(response["payload"]);
                    return response["payload"];
                } else {
                    return throwError('Could not found application with id of ' + id + '!');
                }
            })
        );
    }

    editApplication(application: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.INFLUENCER_URL}edit-application`, application);
    }

    previewMode: boolean = false;
    isPreviewMode(previewMode: boolean) {
        this.previewMode = previewMode;
    }

    getPreviewMode() {
        return this.previewMode;
    }

    /**
     * Create application
     */
    createApplication(): Observable<Application> {
        return this.applications$.pipe(
            take(1),
            switchMap(applications => this._httpClient.post<Application>('api/apps/contacts/contact', {}).pipe(
                map((newApplication) => {

                    // Update the applicationa with the new application
                    this._applications.next([newApplication, ...applications]);

                    // Return the new application
                    return newApplication;
                })
            ))
        );
    }

}
