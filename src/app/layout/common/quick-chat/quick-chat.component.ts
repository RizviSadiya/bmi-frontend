import { Component, ElementRef, ChangeDetectorRef, HostBinding, HostListener, NgZone, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { QuickChatService } from 'app/layout/common/quick-chat/quick-chat.service';
// import { Chat } from 'app/layout/common/quick-chat/quick-chat.types';
import { Chat } from 'app/modules/admin/apps/chat/chat.types';
import { ChatConnectService } from 'app/core/services/chat.service';
import { UserService } from 'app/core/user/user.service';

@Component({
    selector: 'quick-chat',
    templateUrl: './quick-chat.component.html',
    styleUrls: ['./quick-chat.component.scss'],
    encapsulation: ViewEncapsulation.None,
    exportAs: 'quickChat'
})
export class QuickChatComponent implements OnInit, OnDestroy {
    @ViewChild('messageInput') messageInput: ElementRef;
    chat: Chat;
    chats: Chat[];
    opened: boolean = false;
    selectedChat: Chat;
    private _scrollStrategy: ScrollStrategy = this._scrollStrategyOptions.block();
    private _overlay: HTMLElement;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    textMessage: string = '';
    token: string = localStorage.getItem("accessToken");
    senderId = JSON.parse(localStorage.getItem("userDetails")).id;
    receiverId;
    channelId;
    chnnel_id;
    openedFromHere: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _elementRef: ElementRef,
        private _renderer2: Renderer2,
        private _ngZone: NgZone,
        private _quickChatService: QuickChatService,
        private _scrollStrategyOptions: ScrollStrategyOptions,
        private _changeDetectorRef: ChangeDetectorRef,
        private _ccService: ChatConnectService,
        private _userService: UserService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Decorated methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Host binding for component classes
     */
    @HostBinding('class') get classList(): any {
        return {
            'quick-chat-opened': this.opened
        };
    }

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

                // Get the scrollHeight and subtract the vertical padding
                this.messageInput.nativeElement.style.height = `${this.messageInput.nativeElement.scrollHeight}px`;
            });
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    userDetail:any
    ngOnInit(): void {
        // Chat
        this.userDetail = this._userService.userDetails;
        this.channelId= this._quickChatService.getChannelId()
        console.log("Quickchat userDetail",this.userDetail);
        console.log("Quickchat channelId",this.channelId);
        
        this._quickChatService.chat$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chat: Chat) => {
                this.chat = chat;
                if (chat) {
                    this.receiverId = chat.contact.id;
        this.channelId= chat.channel
        // this.channelId= this._quickChatService.getChannelId()

                    // this.receiverId = chat.receiver_id;
                    console.log("receiverId",this.receiverId)
                    console.log("channelId",this.channelId)
                }
                
                this._changeDetectorRef.markForCheck();
            });

        // Chats
        this._quickChatService.chats$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chats: Chat[]) => {
                this.chats = chats;
                
                console.log(this.chats);
            });

        // Selected chat
        this._quickChatService.chat$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chat: Chat) => {
                this.selectedChat = chat;
                console.log(chat);
                if (chat) {
                    this.initiateChat();
                    this.toggle();
                }
            });

        // Toggle chat
        this._quickChatService.toggleChat$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value: boolean) => {
                if (value) {
                    this.toggle();
                } else {
                    this.close();
                }
            });
    }

    initiateChat() {
        if (this.receiverId) {
            this._ccService.chatSubject.subscribe(
                msg => {
                    console.log('Message from server => ', msg );
                    if (msg['command'] === "message") {
                        let newMsg = {
                            createdAt: msg['created_at'],
                            // id: this.chat.message[this.chat.message.length - 1].id + 1,
                            id: this.selectedChat.contact.id,
                            isMine: false,
                            value: msg['message'] ,
                          
                        };
                        console.log("111111111===this.userDetail.id && this.channelId.channel_id ===this.selectedChat.channel.id",this.senderId,this.userDetail.id , this.channelId.channel_id ,this.selectedChat.channel.id);
                        
                        if(this.senderId===this.userDetail.id||this.senderId===this.userDetail.id && this.channelId.channel_id ===this.selectedChat.channel.id ){
                
                        this.chat.message.push(newMsg);
                            
                        }
                        // this.chat.message.push(newMsg);
                        this.chat.lastMessage = msg['message'];
                        this.chat.lastMessageAt = msg['created_at'];
                        // this._chatService.updateUsersChat(this.chat);
                        this._changeDetectorRef.markForCheck();
                    } else if (msg['message'] === "Messege Sent") {
                       
                        
                        let newMsg = {
                            createdAt: msg['created_at'],
                            // id: this.chat.message[this.chat.message.length - 1].id + 1,
                            id: this.selectedChat.contact.id,
                            isMine: true,
                            value: this.textMessage
                        };
                        console.log("2222222222===this.userDetail.id && this.channelId.channel_id ===this.selectedChat.channel.id",this.senderId,this.userDetail.id , this.channelId.channel_id ,this.selectedChat.channel.id);
                        
                        if(this.senderId===this.userDetail.id && this.channelId.channel_id ===this.selectedChat.channel.id ){
                            
                            this.chat.message.push(newMsg);

                                
                            }
                        // this.chat.message.push(newMsg);
                        this.chat.lastMessage = this.textMessage;
                        this.chat.lastMessageAt = msg['created_at'];
                        this.textMessage = "";
                        // this._chatService.updateUsersChat(this.chat);
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
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open the panel
     */
    open(): void {
        // Return if the panel has already opened
        if (this.opened) {
            return;
        }

        // Open the panel
        this._toggleOpened(true);
    }

    /**
     * Close the panel
     */
    close(): void {
        // Return if the panel has already closed
        if (!this.opened) {
            return;
        }

        // Close the panel
        this._toggleOpened(false);
    }

    /**
     * Toggle the panel
     */
    toggle(): void {
        if (this.opened && !this.openedFromHere) {
            this.close();
            this._quickChatService.clearChat();
            // this._quickChatService.getHelp('').subscribe();
            
        }
        else {
            this.open();
        }
    }

    /**
     * Select the chat
     *
     * @param id
     */

    selectChat(id): void {
        this.openedFromHere = true;

        // Open the panel
        this._toggleOpened(true);
console.log("id",id);

// console.log("channelId",this.channelId);
let senderId
if(this.userDetail.id===id.receiver_id){
senderId=id.sender_id
}else{
    senderId=id.receiver_id
}
        this.channelId =id
        // Get the chat data
        let payload = {
            "channel_id":id.channel_id,
            "plateform_type":id.plateform_type,
            "user_id":senderId
          }
          this._quickChatService.getChatByChannelId(payload).subscribe(res=>{
            for (let i = 0; i < this.chats.length; i++) {

                // if (this.chats[i].channel === res.channel) {
                  this.chats[i].channel.is_read = 1;
                
                console.log(" this.chats[i].channel.is_read", this.chats[i].channel.is_read);
                  
                // }
              }
          })
        // this._quickChatService.getChatById(id).subscribe();
        // this._quickChatService.getChats().subscribe()
      
    }

    /**
     * Send Message
     */
    sendMessage(): void {
        if (this.textMessage.trim().length > 0) {
            console.log("channelId",this.channelId);
            
            this._ccService.chatSubject.next({ command: "message", token: this.token+ ',,+'+ this.channelId.channel_id + ',,+' +this.channelId.plateform_type  , from: this.senderId, to: this.receiverId , message: this.textMessage.trim()});
      console.log("  'this._ccService.chatSubject.next({ message: ",    this.textMessage.trim() + ',,+'+ this.channelId.channel_id + ',,+' +this.channelId.plateform_type );
      
      
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

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Show the backdrop
     *
     * @private
     */
    private _showOverlay(): void {
        // Try hiding the overlay in case there is one already opened
        this._hideOverlay();

        // Create the backdrop element
        this._overlay = this._renderer2.createElement('div');

        // Return if overlay couldn't be create for some reason
        if (!this._overlay) {
            return;
        }

        // Add a class to the backdrop element
        this._overlay.classList.add('quick-chat-overlay');

        // Append the backdrop to the parent of the panel
        this._renderer2.appendChild(this._elementRef.nativeElement.parentElement, this._overlay);

        // Enable block scroll strategy
        this._scrollStrategy.enable();

        // Add an event listener to the overlay
        this._overlay.addEventListener('click', () => {
            this.close();
        });
    }

    /**
     * Hide the backdrop
     *
     * @private
     */
    private _hideOverlay(): void {
        if (!this._overlay) {
            return;
        }

        // If the backdrop still exists...
        if (this._overlay) {
            // Remove the backdrop
            this._overlay.parentNode.removeChild(this._overlay);
            this._overlay = null;
        }

        // Disable block scroll strategy
        this._scrollStrategy.disable();
    }

    /**
     * Open/close the panel
     *
     * @param open
     * @private
     */
    private _toggleOpened(open: boolean): void {
        // Set the opened
        this.opened = open;

        // If the panel opens, show the overlay
        if (open) {
            this._showOverlay();
        }
        // Otherwise, hide the overlay
        else {
            this._hideOverlay();
        }
    }
}
