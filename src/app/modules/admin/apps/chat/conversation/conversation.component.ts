import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, map, catchError, tap } from 'rxjs/operators';
import { BmiMediaWatcherService } from '@bmi/services/media-watcher';
import { Chat } from 'app/modules/admin/apps/chat/chat.types';
import { ChatService } from 'app/modules/admin/apps/chat/chat.service';
import { ChatConnectService } from 'app/core/services/chat.service';

@Component({
    selector: 'chat-conversation',
    templateUrl: './conversation.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationComponent implements OnInit, OnDestroy {
    @ViewChild('messageInput') messageInput: ElementRef;
    chat: Chat;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    textMessage: string = '';
    token: string = localStorage.getItem("accessToken");
    senderId = JSON.parse(localStorage.getItem("userDetails")).id;
    receiverId;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _chatService: ChatService,
        private _fuseMediaWatcherService: BmiMediaWatcherService,
        private _ngZone: NgZone,
        private _ccService: ChatConnectService
    ) {
        // this._ccService.connect();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Decorated methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resize on 'input' and 'ngModelChange' events
     *
     * @private
     */
    @HostListener('input')
    @HostListener('ngModelChange')
    private _resizeMessageInput(): void {
        // This doesn't need to trigger Angular's change detection by itself
        this._ngZone.runOutsideAngular(() => {

            setTimeout(() => {

                // Set the height to 'auto' so we can correctly read the scrollHeight
                this.messageInput.nativeElement.style.height = 'auto';

                // Detect the changes so the height is applied
                this._changeDetectorRef.detectChanges();

                // Get the scrollHeight and subtract the vertical padding
                this.messageInput.nativeElement.style.height = `${this.messageInput.nativeElement.scrollHeight}px`;

                // Detect the changes one more time to apply the final height
                this._changeDetectorRef.detectChanges();
            });
        });
    }

    messages: string[] = [];
    destroyed$ = new Subject();

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.receiverId = this._activatedRoute.firstChild?.snapshot.params['id'];

        // Chat
        this._chatService.chat$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chat: Chat) => {
                if (chat) {
                    this.chat = chat;
                    console.log("rizvi chat",chat);
                    
                    this.receiverId = chat.contact.id;

                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                }
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {

                // Set the drawerMode if the given breakpoint is active
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                }
                else {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        if (this.receiverId) {
            this._ccService.chatSubject.subscribe(
                msg => {
                    console.log('Message from server => ', msg);
                    if (msg['command'] === "message") {
                        let newMsg = {
                            createdAt: msg['created_at'],
                            id: this.chat.message[this.chat.message.length - 1].id + 1,
                            isMine: false,
                            value: msg['message']
                        };
                        this.chat.message.push(newMsg);
                        this.chat.lastMessage = msg['message'];
                        this.chat.lastMessageAt = msg['created_at'];
                        this._chatService.updateUsersChat(this.chat);
                        this._changeDetectorRef.markForCheck();
                    } else if (msg['message'] === "Messege Sent") {
                        let newMsg = {
                            createdAt: msg['created_at'],
                            id: this.chat.message[this.chat.message.length - 1].id + 1,
                            isMine: true,
                            value: this.textMessage
                        };
                        this.chat.message.push(newMsg);
                        this.chat.lastMessage = this.textMessage;
                        this.chat.lastMessageAt = msg['created_at'];
                        this.textMessage = "";
                        this._chatService.updateUsersChat(this.chat);
                        this._changeDetectorRef.markForCheck();
                    }
                },
                error => {
                    console.log('Error with websocket connection : ', error)
                },
                () => {
                    console.log('complete and close connection.');
                });
            this._ccService.chatSubject.next({ command: "register", userId: this.senderId + '', token: this.token + '' });

        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this.destroyed$.next();
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset the chat
     */
    resetChat(): void {
        // this._ccService.chatSubject.next(JSON.stringify({ command: "close" }));
        this._chatService.resetChat();

        // Close the contact info in case it's opened
        this.drawerOpened = false;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle mute notifications
     */
    sendMessage(): void {
        if (this.textMessage.trim().length > 0) {
            // this._ccService.chatSubject.next({ command: "register", userId: this.senderId, token: this.token });
            this._ccService.chatSubject.next({ command: "message", token: this.token, from: this.senderId, to: this.receiverId, message: this.textMessage.trim() });
            // this._ccService.connect();
            // this._ccService.sendMessage(JSON.stringify({ command: "register", userId: this.senderId, token: this.token }));
            // this._ccService.sendMessage(JSON.stringify({ command: "message", token: this.token, from: this.senderId, to: '2', message: this.textMessage.trim() }));

            // Update the chat on the server
            // this._chatService.updateChat(this.chat.id, this.chat).subscribe();
        }
    }

    onKeyBoardPress(event) {
        if (event.keyCode == 13) {
            // If Enter Key is pressed, send the message
            this.sendMessage();
        }
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
