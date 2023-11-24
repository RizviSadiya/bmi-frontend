import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Chat } from 'app/layout/common/quick-chat/quick-chat.types';

import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class QuickChatService {
    private _chat: BehaviorSubject<Chat> = new BehaviorSubject(null);
    private _chats: BehaviorSubject<Chat[]> = new BehaviorSubject<Chat[]>(null);
    private _toggleChat: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for chat
     */
    get chat$(): Observable<Chat> {
        return this._chat.asObservable();
    }

    /**
     * Getter for chat
     */
    get chats$(): Observable<Chat[]> {
        return this._chats.asObservable();
    }

    get toggleChat$(): Observable<boolean> {
        return this._toggleChat.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get chats
     */
    getChats(): Observable<any> {
        return this._httpClient.get<any[]>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}all-users`).pipe(
            tap((response: any[]) => {
                this._chats.next(response['payload']);
            })
        );
    }

    /**
     * Get chat
     *
     * @param id
     */
    getChatById(id: string): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}new-chat`, { user_id: id }).pipe(
            map((chat) => {

                // Update the chat
                this._chat.next(chat['payload']);

                // Return the chat
                return chat;
            }),
            switchMap((chat) => {

                if (!chat) {
                    return throwError('Could not found chat with id of ' + id + '!');
                }

                return of(chat);
            })
        );
    }

    getChatByChannelId(payload): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}new-chat`, payload).pipe(
            map((chat) => {


                // Update the chat
                this._chat.next(chat['payload']);

                // Return the chat
                return chat;
            }),
            switchMap((chat) => {

                if (!chat) {
                    return throwError('Could not found chat with id of ' + payload + '!');
                }

                return of(chat);
            })
        );
    }

    channelId:any
    sendChannelId(x){
this.channelId=x
    }

    getChannelId(){
        return this.channelId
    }

    getHelp(id: string): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}help-msg`, {}).pipe(
            map((chat) => {

                // Update the chat
                this._chat.next(chat['payload']);

                // Return the chat
                return chat;
            }),
            switchMap((chat) => {

                if (!chat) {
                    return throwError('Could not found chat with id of ' + id + '!');
                }

                return of(chat);
            })
        );
    }

    toggleChat(value: boolean) {
        this._toggleChat.next(value);
    }

    clearChat() {
        this._chat.next(null);
    }
}
