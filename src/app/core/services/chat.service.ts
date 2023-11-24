import { Injectable } from "@angular/core";
import { Observable, Subject, EMPTY } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { catchError, tap, switchAll, switchMap, retryWhen, delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


export interface Message {
    author: string;
    message: string;
}

@Injectable()
export class ChatConnectService {
    private socket$: WebSocketSubject<any>;
    private messagesSubject$ = new Subject();

    public messages$ = this.messagesSubject$.pipe(switchAll(), catchError(e => { throw e }));

    public messages: Subject<Message>;

    
    chatSubject = webSocket(environment.CHAT_ENDPOINT);

    constructor() {
    }

    connection(): Observable<any> {
        if (!this.socket$ || this.socket$.closed) {
            this.socket$ = webSocket(environment.CHAT_ENDPOINT);
        }
        return this.socket$;
    }

    public connect(): void {
        if (!this.socket$ || this.socket$.closed) {
            this.socket$ = this.getNewWebSocket();
            // const messages = this.socket$.pipe(
            //     tap({
            //         error: error => console.log(error),
            //     }), catchError(_ => EMPTY));
            // this.messagesSubject$.next(messages);
        }
        this.socket$.subscribe(
            msg => {
                console.log('Message from server => ', msg)
            },
            err => {
                console.log('Error with websocket connection : ', err)
            },
            () => {
                console.log('complete and close connection.');
            });
    }

    private getNewWebSocket() {
        return webSocket(environment.CHAT_ENDPOINT);
    }

    sendMessage(message: any) {
        console.log("inside send message method...");
        console.log("this.socket$.closed : " , this.socket$.closed);

        if (!this.socket$ || this.socket$.closed) {
            console.error('Did not send data, open a connection first');
        } else {
            this.socket$.next(message);
        }
    }

    closeConnection() {
        if (this.socket$) {
            this.socket$.complete();
            this.socket$ = null;
        }
    }

    send(message: any) {
        this.chatSubject.next(message);
    }

    receiveMessage() {
        this.chatSubject.subscribe(
            msg => console.log('message received: ', msg), // Called whenever there is a message from the server.
            err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
            () => console.log('complete') // Called when connection is closed (for whatever reason).
        );
    }

}