import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { BmiConfirmationService } from '@bmi/services/confirmation';
import { Order } from 'app/modules/admin/apps/orders/orders.types';
import { OrdersListComponent } from 'app/modules/admin/apps/orders/list/list.component';
import { OrdersService } from 'app/modules/admin/apps/orders/orders.service';
import { UserService } from 'app/core/user/user.service';
import { QuickChatService } from 'app/layout/common/quick-chat/quick-chat.service';

@Component({
    selector: 'orders-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersDetailsComponent implements OnInit, OnDestroy {
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;

    reviewMode: boolean = false;
    appCampaign: any;
    // appInfo: any;
    order: Order;
    contactForm: FormGroup;
    orders: Order[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    orderForm: FormGroup;
    defaultPrice: number = 25000;
    defaultPriceSelected: boolean = false;
    userType: string = "INFLUENCER";

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _ordersListComponent: OrdersListComponent,
        private _ordersService: OrdersService,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: BmiConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private _userService: UserService,
        private _quickChatService: QuickChatService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
     userCurrency:any
    ngOnInit(): void {
        // Open the drawer
        this._ordersListComponent.orderDrawer.open();
        this.userCurrency = this._userService.userDetails

        console.log("inside order details screen...");
        this.userType = this._userService.userDetails.userType.toUpperCase();

        // Create the order form
        this.contactForm = this._formBuilder.group({
            id: [''],
            avatar: [null],
            name: ['', [Validators.required]],
            emails: this._formBuilder.array([]),
            phoneNumbers: this._formBuilder.array([]),
            title: [''],
            company: [''],
            birthday: [null],
            address: [null],
            notes: [null],
            tags: [[]]
        });

        // Get the orders
        this._ordersService.orders$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((orders: Order[]) => {
                this.orders = orders;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the order
        this._ordersService.order$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((order: Order) => {

                // Open the drawer in case it is closed
                this._ordersListComponent.orderDrawer.open();

                // Get the campaign
                this.order = order;
        console.log("this.order.",this.order);

                this.appCampaign = order.camp_info;
                // this.appInfo = order.app_info
                // Clear the emails and phoneNumbers form arrays
                (this.contactForm.get('emails') as FormArray).clear();
                (this.contactForm.get('phoneNumbers') as FormArray).clear();

                // Patch values to the form
                this.contactForm.patchValue(order);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        if (this.order.status === "0" || this.order.status === "1") {
            this.reviewMode = true;
        }
        console.log(this.order,"sadiya");
    //    this.total_pay = this.order.total_pay
    //    console.log(this.total_pay,"sadiya");

        this.createOrderForm();
    }
    total_pay
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
        if (this._tagsPanelOverlayRef) {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._ordersListComponent.orderDrawer.close();
    }

    /**
     * Toggle review mode
     *
     * @param reviewMode
     */
    toggleReviewMode(reviewMode: boolean | null = null): void {
        if (reviewMode === null) {
            this.reviewMode = !this.reviewMode;
        } else {
            this.reviewMode = reviewMode;
        }
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add the email field
     */
    addEmailField(): void {
        // Create an empty email form group
        const emailFormGroup = this._formBuilder.group({
            email: [''],
            label: ['']
        });

        // Add the email form group to the emails form array
        (this.contactForm.get('emails') as FormArray).push(emailFormGroup);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove the email field
     *
     * @param index
     */
    removeEmailField(index: number): void {
        // Get form array for emails
        const emailsFormArray = this.contactForm.get('emails') as FormArray;

        // Remove the email field
        emailsFormArray.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add an empty phone number field
     */
    addPhoneNumberField(): void {
        // Create an empty phone number form group
        const phoneNumberFormGroup = this._formBuilder.group({
            country: ['us'],
            phoneNumber: [''],
            label: ['']
        });

        // Add the phone number form group to the phoneNumbers form array
        (this.contactForm.get('phoneNumbers') as FormArray).push(phoneNumberFormGroup);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove the phone number field
     *
     * @param index
     */
    removePhoneNumberField(index: number): void {
        // Get form array for phone numbers
        const phoneNumbersFormArray = this.contactForm.get('phoneNumbers') as FormArray;

        // Remove the phone number field
        phoneNumbersFormArray.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number): any {
        console.log(index);
        return index;
    }

    openQuickChat(channel_id) {
        // this._quickChatService.toggleChat(true);
        console.log("channelid",channel_id);
        // openQuickChat(user_id) {
            let payload = {
                "channel_id":channel_id.channelid,
                "plateform_type":channel_id.plateform_type
              }
              this._quickChatService.getChatByChannelId(payload).subscribe();
            // this._quickChatService.getChatById(channel_id.influ_id).subscribe();;
        // }
        // this._toggleOpened(true);
        // this._quickChatService.getChatById(channel_id).subscribe();
    }

    createOrderForm() {
        console.log("app_info",this.order);
        let channel_name
        if(this.order.channel_info){
             channel_name = this.order.channel_info.channel_name
        }
        else{
            channel_name = this.order.instagram_data.username

        }
        this.orderForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                channelName: [channel_name, [Validators.required]],
                amount: [this.order.camp_price, [Validators.required]],
                tnc: [this.order.payment_term, Validators.required],
                tncDisagreeReason: [this.order.tncDisagreeReason],
                secondPreference: [this.order.secondPreference, Validators.required],
                secondPreferenceAlt: [this.order.secondPreferenceAlt],
                firstHalf: [this.order.firstHalf, Validators.required],
                firstHalfAlt: [this.order.firstHalfAlt],
                videoReview: [this.order.videoReview, Validators.required]
            }),
            step2: this._formBuilder.group({
                minimumVideo: [this.order.minimumVideo, Validators.required],
                minimumVideoCount: [this.order.minimumVideoCount],
                changesFlexibility: [this.order.app_info.minor_changes, Validators.required],
                goLiveTime: [this.order.goLiveTime, Validators.required],
                goLiveTimeOther: [this.order.goLiveTimeOther],
                deliveryTime: [this.order.app_info.delivery_days, Validators.required],
                deliveryTimeOther: [this.order.app_info.other_delivery_days],
                shareOnSocial: [this.order.app_info.social_media_share, Validators.required],
                facebook: [this.order.app_info.social_media],
                instagram: [this.order.app_info.social_media],
                twitter: [this.order.app_info.social_media],
                shareUnlistedPreview: [this.order.shareUnlistedPreview, Validators.required],
                nonViolationPolicy: [this.order.nonViolationPolicy, Validators.required]
            }),
            step3: this._formBuilder.group({
                comment: [this.order.userComment]
            })
        });
    }

    backFromPreview() {
        this.reviewMode = false;
    }

    applyCampaign() {
        console.log("Now Campaign Apply---->");
    }

    checkQuotationPrice() {
        let amount = this.orderForm.value.step1.amount;
        if (amount == this.defaultPrice) {
            this.defaultPriceSelected = true;
        } else {
            this.defaultPriceSelected = false;
        }
    }

    setQuotationPrice(event) {
        if (event.checked) {
            this.orderForm.patchValue({
                step1: {
                    amount: this.defaultPrice
                }
            });
        } else {
            this.orderForm.patchValue({
                step1: {
                    amount: ''
                }
            });
        }
    }
}
