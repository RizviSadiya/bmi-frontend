import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { shareReplay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class LandingPageService {

    constructor(private _httpClient: HttpClient) { }

    getChannelList(payload: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}channel-list`, payload).pipe(shareReplay(1));
    }
    // image=
    //     [

    //         {  
    //           "id": 1,  
    //           "image": "assets/images/team/team-1.jpg" 
             
    //         },  
    //         {  
    //           "id": 2,  
    //           "image": "assets/images/team/team-2.jpg"
             
    //         },  
    //         {  
    //           "id": 3,  
    //           "image": "assets/images/team/team-3.jpg"
             
    //         },  
    //         {  
    //           "id": 4,  
    //           "image": "assets/images/team/team-4.jpg"
    //         },  
    //         {  
    //           "id": 5,  
    //           "image": "assets/images/team/team-5.jpg"
    //         }
          
    // ]
}
