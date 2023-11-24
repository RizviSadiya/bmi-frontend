import { ChangeDetectionStrategy, ChangeDetectorRef,ElementRef, Renderer2,Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash-es';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Order } from 'app/modules/admin/apps/orders/orders.types';
import { BmiConfirmationService } from '@bmi/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { OrderDisputeReasonComponent } from 'app/modules/admin/apps/orders/order-dispute-reason/order-dispute-reason.component';
import { UploadVideoComponent } from 'app/modules/admin/apps/orders/upload-video/upload-video.component';
import { CampaignResourcePreviewComponent } from 'app/modules/admin/apps/orders/campaign-resource-preview/campaign-resource-preview.component';
import { CampaignResourceDocumentComponent } from 'app/modules/admin/apps/orders/campaign-resource-document/campaign-resource-document.component';
import { ReviewVideoComponent } from 'app/modules/admin/apps/orders/review-video/review-video.component';
import { OrdersService } from 'app/modules/admin/apps/orders/orders.service';
import { NotificationService } from 'app/core/services/notification.service';
import { QuickChatService } from '../quick-chat/quick-chat.service';
import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';

import { IncreaseDeadlineComponent } from 'app/modules/admin/apps/orders/increase-deadline/increase-deadline.component';

@Component({
  selector: 'insta-order-list',
  templateUrl: './insta-order-list.component.html',
  styleUrls: ['./insta-order-list.component.scss']
})
export class InstaOrderListComponent implements OnInit {
  @Input() order: any;
    @Input() bidAmount: string;
    @Input()completedtab:boolean = false
    @Output() viewClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
    cancelOrderForm: FormGroup;
    userType: string = "INFLUENCER";
    reviewScriptForm: FormGroup;
    reviewPreviewVideoForm: FormGroup;
    reviewLiveVideoForm: FormGroup;

    actionTaken: string[] = ['Place', 'Review', 'RequestChange', 'Submit', 'Approved'];

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _bmiConfirmationService: BmiConfirmationService,
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _userService: UserService,
        private _orderService: OrdersService,
        private _notifyService: NotificationService,
        private NotificationsService: NotificationsService,
        private _quickChatService: QuickChatService,
        private _scrollStrategyOptions: ScrollStrategyOptions,
        private _renderer2: Renderer2,
        private _elementRef: ElementRef,
    ) { }
    userDetails:any;
    ngOnInit(): void {
        this.userType = this._userService.userDetails.userType.toUpperCase();
        this.userDetails = this._userService.userDetails
        console.log("this.userDetails",this.userDetails);
        console.log("this.order",this.order);
        this.order.isReadMore = true;
        this.order.is_revealed = true;
        this.order.is_verified = true;
    
    }

    showText(item: Order) {
        this.order.isReadMore = !this.order.isReadMore;
    }

    onViewClick() {
        this.viewClicked.next(true);
    }

    onReviewCampaignResourceClick() {
        const reviewCampaign = this._matDialog.open(CampaignResourcePreviewComponent, {
            maxHeight: '100vh',
            autoFocus: false,
            data: {
                order: cloneDeep(this.order)
            }
        });

        reviewCampaign.afterClosed().subscribe(result => {
            if (result && result.order_id === this.order.id) {
                this.order = result;
                this._changeDetectorRef.markForCheck();
            }
        });
    }
    newDeadline:any
    increaseOderdDate(order) {
        const reviewCampaign = this._matDialog.open(IncreaseDeadlineComponent, {
            maxHeight: '100vh',
            autoFocus: false,
            data: order
        });

        reviewCampaign.afterClosed().subscribe(result => {
            if (result && result.order_id === this.order.id) {
                this.order = result;
                this.newDeadline=result.payload
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    onSubmitCampaignResourceClick() {
        const resourceDocument = this._matDialog.open(CampaignResourceDocumentComponent, {
            autoFocus: false,
            data: {
                order: cloneDeep(this.order)
            }
        });

        resourceDocument.afterClosed().subscribe(result => {
            if (result && result.order_id === this.order.id) {
                this.order = result;
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    onUploadScriptClick(headerTxt: string) {
        const uploadScript = this._matDialog.open(UploadVideoComponent, {
            autoFocus: false,
            data: {
                headerText: headerTxt,
                order: cloneDeep(this.order)
            }
        });

        uploadScript.afterClosed().subscribe(result => {
            if (result && result.order_id === this.order.id) {
                this.order = result;
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    onReviewVideoScriptClick(headerTxt: string){
        const reviewVideoScript = this._matDialog.open(ReviewVideoComponent, {
            autoFocus: true,
            disableClose: true,
            data: {
                headerText: headerTxt,
                order: cloneDeep(this.order)
            }
        });

        reviewVideoScript.afterClosed().subscribe(result => {
            if (result && result.order_id === this.order.id) {
                this.order = result;
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    onUploadPreviewVideoClick() {
        this._matDialog.open(UploadVideoComponent, {
            autoFocus: false,
            data: {
                order: cloneDeep(this.order)
            }
        });
    }

    onUploadLiveVideoClick() {
        this._matDialog.open(UploadVideoComponent, {
            autoFocus: false,
            data: {
                order: cloneDeep(this.order)
            }
        });
    }

    onReviewScriptClick() {
        this.reviewScriptForm = this._formBuilder.group({
            title: 'Approve Review Script',
            message: 'Are you sure you want to approve this review script?',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:check-circle',
                color: 'success'
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Approve',
                    color: 'success'
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Request Changes',
                    color: 'warn'
                })
            }),
            dismissible: true
        });

        const reviewScriptDialogRef = this._bmiConfirmationService.open(this.reviewScriptForm.value);
        reviewScriptDialogRef.afterClosed().subscribe((result) => {
            console.log(result);
        });
    }

    onReviewPreviewVideoClick() {
        this.reviewPreviewVideoForm = this._formBuilder.group({
            title: 'Approve Preview Video',
            message: 'Are you sure you want to approve this preview video?',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:check-circle',
                color: 'success'
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Approve',
                    color: 'success'
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Request Changes',
                    color: 'warn'
                })
            }),
            dismissible: true
        });

        const reviewPreviewVideoDialogRef = this._bmiConfirmationService.open(this.reviewPreviewVideoForm.value);
        reviewPreviewVideoDialogRef.afterClosed().subscribe((result) => {
            console.log(result);
        });
    }

    onReviewLiveVideoClick() {
        this.reviewLiveVideoForm = this._formBuilder.group({
            title: 'Approve Live Video',
            message: 'Are you sure you want to approve this live video?',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:check-circle',
                color: 'success'
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Approve',
                    color: 'success'
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Request Changes',
                    color: 'warn'
                })
            }),
            dismissible: true
        });

        const reviewLiveVideoDialogRef = this._bmiConfirmationService.open(this.reviewLiveVideoForm.value);
        reviewLiveVideoDialogRef.afterClosed().subscribe((result) => {
            console.log(result);
        });
    }

    ngOnDestroy(): void { }

    raiseDispute(order) {
        this._matDialog.open(OrderDisputeReasonComponent, {
            autoFocus: false,
            data: {
                order: cloneDeep(order)
            }
        });
    }

    cancelOrder(order) {
        this.cancelOrderForm = this._formBuilder.group({
            title: 'Cancel Order',
            message: 'Are you sure you want to cancel this order?',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:exclamation',
                color: 'warn'
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Yes',
                    color: 'warn'
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Cancel'
                })
            }),
            dismissible: true
        });

        // Open the dialog and save the reference of it
        const dialogRef = this._bmiConfirmationService.open(this.cancelOrderForm.value);

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if (result === 'confirmed') {
                console.log(order.id);
                this._orderService.cancelOrder(order.id).subscribe(data => {
                    this._notifyService.showSuccess(data.message, "");
                    this._orderService.getOrders().subscribe(order => {

                    })
                })
            }
        });
    }
    msgCount:any

    openQuickChat(channel_id) {
        // this._quickChatService.toggleChat(true);
        console.log("channelid",channel_id);
        // openQuickChat(user_id) {
            if(this.userDetails.userType==="brand"){
                let payload = {
                    "channel_id":channel_id.channelid,
                    "plateform_type":channel_id.plateform_type
                  }
                  this._quickChatService.getChatByChannelId(payload).subscribe();
            // this._quickChatService.getChatById(channel_id.influ_id).subscribe();
            this.messageCountRead(channel_id)
            }else{
            this._quickChatService.getChatById(channel_id.brand_id).subscribe();
                this.messageCountRead(channel_id)
            }
        // }
        // this._toggleOpened(true);
        // this._quickChatService.getChatById(channel_id).subscribe();
    }

    messageCountRead(channel_id){
     
        if(this.userDetails.userType==="brand"){
          
            this.NotificationsService.messageAsRead(channel_id.influ_id).subscribe(res=>{
                console.log("res",res);
                
            })
    }
    else{
        this.NotificationsService.messageAsRead(channel_id.brand_id).subscribe(res=>{
            console.log("res",res);

        })
    }
    }
    opened: boolean = false;
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
    private _overlay: HTMLElement;
    private _scrollStrategy: ScrollStrategy = this._scrollStrategyOptions.block();
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

    close(): void {
        // Return if the panel has already closed
        if (!this.opened) {
            return;
        }

        // Close the panel
        this._toggleOpened(false);
    }
}
