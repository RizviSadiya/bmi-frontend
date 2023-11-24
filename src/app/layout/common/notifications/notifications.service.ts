import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { Notification } from 'app/layout/common/notifications/notifications.types';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {
    private _notifications: ReplaySubject<Notification[]> = new ReplaySubject<Notification[]>(1);

    constructor(private _httpClient: HttpClient) {
    }

    /**
     * Getter for notifications
     */
    get notifications$(): Observable<Notification[]> {
        return this._notifications.asObservable();
    }

    /**
     * Get all notifications
     */
    getAllNotifications(): Observable<any[]> {
        return this._httpClient.get<any[]>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}notifications`).pipe(
            tap((notifications) => {
                this._notifications.next(notifications['payload']);
            }),
            shareReplay(),
        );
    }

    updateInfo(payload): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT}api/v1/influencer/update-profile`, payload);
    }

  

    makeAsRead(): Observable<any[]> {
        return this._httpClient.get<any[]>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}read-all`);
    }

    messageAsRead(user_id:any): Observable<any[]> {
        return this._httpClient.post<any[]>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}read-user-message`,{user_id:user_id});
    }
}
