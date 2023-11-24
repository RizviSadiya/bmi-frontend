import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, shareReplay, switchMap, take, tap } from 'rxjs/operators';

import { AddChannel } from './add-channel.types';
import { environment } from '../../../../../environments/environment';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AddChannelService {

    constructor(private _httpClient: HttpClient,
        @Inject(DOCUMENT) private document: Document,
    
        ) {

        }

 
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
   
    addChannel(channel: AddChannel): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.INFLUENCER_URL}add-channel`, channel);
    }

    autoSuggestChannelList(search_keyword): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}channel-auto-suggest`, search_keyword);
    }

    makeAsRead(): Observable<any[]> {
        return this._httpClient.get<any[]>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL_V2}instagram/login`);
    }
  
    loginWithInstagam() { 
        this._httpClient.get(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL_V2}instagram/login`).subscribe(res=>{
console.log("res",res);

        })
        // .pipe(
        //     tap((applications) => {
        //         if (applications["success"]) {
        //             this._application.next(applications["payload"]);
                  
        //         } else {
        //             this._application.next(null);
                  
        //         }
        //     }),
          
        // );
    }
}
