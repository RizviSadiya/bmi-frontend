import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { UserService } from 'app/core/user/user.service';
@Injectable({
    providedIn: 'root'
})
export class ProfileService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    user_detail:any
    constructor(private _httpClient: HttpClient, private http:HttpClient, private userservice:UserService)
    {
        // this.user_detail = this.userservice.userDetails
        // console.log("this.user_detail",this.user_detail);
        
    }

    /**
     * Getter for data
     */
    get data$(): Observable<any>
    {
        return this._data.asObservable();
    }

    getpublicurlData(channel_id?: string , uuid?:any): Observable<any> {
        const url = `${environment.API_BASE_ENDPOINT}/${channel_id}/${uuid}`;
        return this.http.get(url);
      }

    getData(channel_id?: string , uuid?:any): Observable<any>
    {

        let default_channel = channel_id ? channel_id : localStorage.getItem("default_channel");
        // let uuId = uuid ? uuid : localStorage.getItem("userDetails");
        console.log("service uuid",uuid);
        
        return this._httpClient.get<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}public-profile/${default_channel}/${uuid}`).pipe(
            tap((response: any) => {
                console.log(response);
                this._data.next(response);
            })
        );
        return this._httpClient.get('api/dashboards/project').pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }
}
