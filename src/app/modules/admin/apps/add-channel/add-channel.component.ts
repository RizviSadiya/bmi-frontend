import { ChangeDetectorRef, Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewEncapsulation, Inject } from '@angular/core';
import { Observable, Subject, SubscriptionLike } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { bmiAnimations } from '@bmi/animations';
import { BmiAlertType } from '@bmi/components/alert';
import { MatDialog } from '@angular/material/dialog';
import { AddChannelService } from 'app/modules/admin/apps/add-channel/add-channel.service';
import { NotificationService } from 'app/core/services/notification.service';
import { VerifyChannelPopupComponent } from 'app/layout/common/verify-channel-popup/verify-channel-popup.component';
import { FormControl } from '@angular/forms';
import { UserService } from 'app/core/user/user.service';
import { ChannelService } from 'app/layout/common/channel/all-channels.service';
import { Channel } from 'app/layout/common/channel/all-channels.types';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Location } from '@angular/common';
import { environment } from 'environments/environment';
@Component({
    selector: 'add-channel',
    templateUrl: './add-channel.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: bmiAnimations
})

export class AddChannelComponent implements OnInit, OnDestroy {
    subscription: SubscriptionLike;
    addChannelForm: FormGroup;
    totalChannels: number = 0;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    submitted = false;
    loading = false;
    alert: { type: BmiAlertType; message: string } = {
        type: 'success',
        message: null
    };
    userDetails: any
    // @Output() readonly totalChannels: EventEmitter<number> = new EventEmitter<number>();

    /**
     * Constructor
     */
    channel$: Observable<Channel[]>;

    constructor(
        private _matDialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _channelService: AddChannelService,
        private _notifyService: NotificationService,
        private _userService: UserService,
        private _allChannelService: ChannelService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private location: Location,
        @Inject(DOCUMENT) private document: Document,

    ) {
    }
    instaFbLogin: any
    token: any
    platformValue = 'youtube'
    ngOnInit(): void {
        // Create the channel form
        this.userDetails = this._userService.userDetails;
        this.addChannelForm = this._formBuilder.group({
            plateform: ["youtube", Validators.required],
            channel_link: ["", Validators.required],
            channel_lang: ["Hindi"],
            promotion_price: ["", Validators.required],
            currency: [this.userDetails.currency, Validators.required],
            is_default: [false]
        });

        this.token = this.userDetails.access_token
        console.log("token", this.token);

        // this._channelService.loginWithInstagam().subscribe(res=>{
        //     this.instaFbLogin=res
        //     console.log("instaFbLogin",this.instaFbLogin);

        //     // // (window as any).open(res, "_blank");
        //     // // window.location.href = ''+res
        //     // let url =res
        //     // this.document.location.replace(res)
        // })
        // this.searchInfluencer()
        this._allChannelService.channelCount$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count) => {

                // Update the selected campaign
                this.totalChannels = count;
                console.log("totalChannels", this.totalChannels);


                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    selectValue(event) {
        console.log("event", event.value);
        this.platformValue = event.value
        // debugger
        if (this.platformValue === 'instagram') {
            // console.log("loginWithInstagam");

            // this._channelService.makeAsRead()
            // .subscribe(res=>{
            //     console.log("response",res);

            //     // window.open(res, "_blank");
            //     // // window.location.href = ''+res
            //     // let url =res
            //     // this.document.location.replace(res)
            // })
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + this.token);
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("user_id", this.userDetails.id);



            let IGLogin = environment.API_BASE_ENDPOINT+environment.PUBLIC_URL_V2+'instagram/login';
            fetch(IGLogin, {
                method: 'GET',
                headers: myHeaders,

                redirect: 'follow'
            })
                .then(response => response.text())
                .then(result => window.open(result))
                .catch(error => console.log('error', error));


            let redirectURL = this._activatedRoute.snapshot.queryParamMap.get('instagram')
            // console.log("redirectURL",this._router.url);
            console.log("redirectURL", redirectURL);

        }
        let client_id = this.location.path();
        console.log("client_id", client_id);

    }

    myCallback(data: any) {
        console.log('Callback invoked:', data);
        // Handle the callback data
    }

    get channel() { return this.addChannelForm.controls; }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        // this._unsubscribeAll.next();
        // this._unsubscribeAll.complete();
    }

    addNewChannel(): void {
        let me = this;
        this.submitted = true;
        if (this.addChannelForm.invalid) {
            // console.log("addChannelForm", this.addChannelForm)
            return;
        }
        if (this.addChannelForm.get('promotion_price').value < 100 && this.addChannelForm.get('currency').value != 'USD') {
            this._notifyService.showError("promotion_price should be greaterthen Hundred (100)", 'error')
            return;
        }
        console.log("addChannelForm", this.addChannelForm.value);

        this.loading = true;
        const channel = this.addChannelForm.getRawValue();

        channel.is_default = channel.is_default ? 1 : 0;

        // Add the channel to the server
        this._channelService.addChannel(channel).subscribe(
            data => {
                console.log(data);

                this.loading = false;
                this.alert = {
                    type: 'success',
                    message: 'Congratulations! You have added a new channel.'
                };
                this._notifyService.showSuccess(data.message, "");
                this.submitted = false;
                this.resetAddChannelForm();
                const topDiv: HTMLElement = document.getElementById('topDiv');
                this.scroll(topDiv);

                this.verifyChannel(data['payload']);
                this._changeDetectorRef.markForCheck();

            }, (error) => {
                me.loading = false;
                me.alert = {
                    type: 'error',
                    message: error
                };
                this._changeDetectorRef.markForCheck();
            }
        );
    }

    //auto search start
    opened: boolean = false;
    channel_link: FormControl = new FormControl();
    @Input() appearance: 'basic' | 'bar' = 'basic';
    @Input() minLength: number = 3;
    filteredOptions;
    keyupValue: any
    onKeydown(event: KeyboardEvent): void {
        // Listen for escape to close the search
        // if the appearance is 'bar'
        console.log("event", event)
        let keyValue = event.key
        console.log("keyValue", keyValue)


        let obj = {
            "search_keyword": event
        }
        this._channelService.autoSuggestChannelList(obj).subscribe(res => {
            if (res.code == 200) {
                this.filteredOptions = res.payload.channel_list
                // console.log("filteredOptions",this.filteredOptions);

            }
        })

        if (this.appearance === 'bar') {

            // Escape
            if (event.code === 'Escape') {
                // Close the search
                this.close();
            }
        }
    }
    close(): void {
        // Return if it's already closed
        if (!this.opened) {
            return;
        }
    }


    onEnter() {
        console.log(this.channel_link.value);
        let searchValue = this.channel_link.value;
        // console.log("searchValueonEnter", searchValue);
        // if (searchValue.length >= this.minLength) {
        //     this._router.navigate(['/apps/influencers', searchValue]);
        // }
    }

    searchInfluencer() {
        let searchValue = this.channel_link.value;
        // console.log("searchValue", searchValue);

        // if (searchValue.length >= this.minLength) {
        //     this._router.navigate(['/apps/influencers', searchValue]);
        // }
    }

    onResultSelection(e) {
        this.channel_link.setValue(e);
        // this._router.navigate(['/apps/influencers', e]);
        // console.log("esssssssssssss", e);
        // this.addChannelForm.controls.channel_link.setValue(this.channel_link)
        // console.log("channel_link", this.channel_link);

    }

    // autoSuggestChannelList(){

    // }

    //auto search end
    verifyChannel(addedChannel) {
        const verifyChannelPopup = this._matDialog.open(VerifyChannelPopupComponent, {
            maxHeight: '95vh',
            width: '80vw',
            autoFocus: true,
            disableClose: true,
            data: {
                channel: addedChannel
            }
        });

        verifyChannelPopup.afterClosed().subscribe(response => {
            if (response.success) {
                // Verify Channel popup closed, Update the UI
                if (addedChannel.id === response.payload.id) {
                    addedChannel.is_verified = 1;

                }
                this._notifyService.showSuccess(response.message, "");
                this._changeDetectorRef.markForCheck();

            }
            window.location.reload()
        });
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

    scroll(el: HTMLElement) {
        el.scrollIntoView({ behavior: 'smooth' });
    }

    totalChannelsReceived(event) {
        // this.totalChannels = event;
        console.log("event", this.totalChannels)
    }
    channels
    filter = 'youtube'
    filterValue(event) {
        console.log("event", event);
        this.filter = event
        if (event === '2') {
            let payload = {
                "plateform_type": event,
                "page": '1',
                "perPage": 10,
            }


            // Get the data
            this._allChannelService.getChannels(payload).subscribe((data) => {
                this.channels = data['payload'];
                this.totalChannels = data['payload'].totalCount;
                // // this.data = data;
                // // Execute the observable
                // this.totalChannels.next(this.channels.length);
                this._changeDetectorRef.markForCheck();
            });
        } else {
            let payload = {
                "plateform_type": event,
                "page": '1',
                "perPage": 10,
            }


            // Get the data
            this._allChannelService.getChannels(payload).subscribe((data) => {
                this.channels = data['payload'];
                this.totalChannels = data['payload'].totalCount;
                // // this.data = data;
                // // Execute the observable
                // this.totalChannels.next(this.channels.length);
                this._changeDetectorRef.markForCheck();
            });
        }
    }

    resetAddChannelForm() {
        this.addChannelForm.patchValue({
            plateform: this.platformValue,
            channel_link: "",
            channel_lang: "Hindi",
            promotion_price: "",
            currency: "INR",
            is_default: false
        });
    }
}
