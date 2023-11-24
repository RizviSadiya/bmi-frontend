import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash-es';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { BmiAlertType } from '@bmi/components/alert';
import { bmiAnimations } from '@bmi/animations';

import { Application } from 'app/modules/admin/apps/applications/applications.types';
import { ApplicationsListComponent } from 'app/modules/admin/apps/applications/list/list.component';
import { ApplicationsService } from 'app/modules/admin/apps/applications/applications.service';
import { CampaignsService } from 'app/modules/admin/apps/campaigns/campaigns.service';
import { PaymentGuidelinesPopupComponent } from 'app/layout/common/payment-guidelines-popup/payment-guidelines-popup.component';
import { Channel } from 'app/layout/common/channel/all-channels.types';
import { NotificationService } from 'app/core/services/notification.service';
import { UserService } from 'app/core/user/user.service';

@Component({
    selector: 'applications-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: bmiAnimations
})
export class ApplicationsDetailsComponent implements OnInit, OnDestroy {
    reviewMode: boolean = false;
    application: Application;
    channelList: Channel[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    applicationForm: FormGroup;
    defaultPrice: number = 0;
    defaultPriceSelected: boolean = false;
    stepperOrientation: Observable<StepperOrientation>;
    selectedChannelName: string;
    loading = false;
    alert: { type: BmiAlertType; message: string } = {
        type: 'success',
        message: null
    };
    previewMode: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _applicationsListComponent: ApplicationsListComponent,
        private _applicationsService: ApplicationsService,
        private _campaignsService: CampaignsService,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _router: Router,
        private _userService: UserService,

        breakpointObserver: BreakpointObserver,
        private _notifyService: NotificationService
    ) {
        this.stepperOrientation = breakpointObserver
            .observe('(min-width: 800px)')
            .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
     camData:any
    ngOnInit(): void {
        // Open the drawer
        this.camData =this._userService.getData()

        this._applicationsListComponent.applicationDrawer.open();

        // Get the application
        this._applicationsService.application$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((application: Application) => {
                // Open the drawer in case it is closed
                this._applicationsListComponent.applicationDrawer.open();
                // Get the campaign
                this.application = application;
                console.log("application",this.application);
                
                            // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the channels
        this._campaignsService.channels$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((channels: Channel[]) => {
                this.channelList = channels.filter(channel => channel.title !== "");
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // If preview button is clicked from Pending proposals tab
        this.previewMode = this._applicationsService.getPreviewMode();

        if (this.application.status == '3' || this.application.status == '5' || this.previewMode) {
            this.reviewMode = true;
        }else{
            
        }

        this.createApplicationForm();
       
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
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._applicationsListComponent.applicationDrawer.close();
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
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number): any {
        console.log(index);
        return index;
    }

    createApplicationForm() {
        let selectedSocialMedia = [];
        if (this.application.social_media) {
            selectedSocialMedia = this.application.social_media.split(",");
        }
        this.applicationForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                channel_id: [this.application.channel_id, [Validators.required]],
                currency: [this.application.currency, [Validators.required]],
                price: [this.application.price, [Validators.required]],
                old_duration: [this.application.old_duration, Validators.required],
                new_duration: [this.application.new_duration],
                promotion_slot: [this.application.promotion_slot, Validators.required],
                new_promotion_slot: [this.application.new_promotion_slot]
            }),
            step2: this._formBuilder.group({
                view_commitment: [this.application.view_commitment, Validators.required],
                min_views: [this.application.min_views],
                minor_changes: [this.application.minor_changes, Validators.required],
                delivery_days: [this.application.delivery_days, Validators.required],
                other_delivery_days: [this.application.other_delivery_days],
                social_media_share: [this.application.social_media_share, Validators.required],
                facebook: [selectedSocialMedia.indexOf("facebook") != -1],
                instagram: [selectedSocialMedia.indexOf("instagram") != -1],
                twitter: [selectedSocialMedia.indexOf("twitter") != -1],
                privacyPolicy: [this.application.privacy_policy === 1 ? true : false, Validators.required]
            }),
            step3: this._formBuilder.group({
                comment: [this.application.comment]
            })
        });
        this.channelSelected(this.application.channel_id);
        this.checkQuotationPrice();
    }

    backFromPreview() {
        this.reviewMode = false;
    }

    channelSelected(selection) {
        let selectedChannel = this.channelList.filter(channel => channel.id === selection)[0];
        if (selectedChannel) {
            this.selectedChannelName = selectedChannel.title;
            this.defaultPrice = selectedChannel.promotion_price;
        } else {
            this.selectedChannelName = "";
            this.defaultPrice = 0;
        }
    }

    nextpage(){
        console.log("this.applicationForm",this.applicationForm.value);
        
    }

    applyCampaign() {
        if (this.applicationForm.invalid) {
            return;
        }
        this.loading = true;

        let campaignApplicationForm: Application;
        console.log("campaignApplicationForm",campaignApplicationForm);
        
        const paymentGuidelinePopupDialog = this._matDialog.open(PaymentGuidelinesPopupComponent, {
            autoFocus: false,
            data: {
                campaign: cloneDeep(campaignApplicationForm)
            }
        });

        paymentGuidelinePopupDialog.afterClosed().subscribe(result => {
            if (result) {
                let formValue = this.applicationForm.getRawValue();
                let social_media = "";
                if (formValue.step2.facebook) {
                    social_media += "facebook";
                }
                if (formValue.step2.instagram) {
                    let text = "";
                    text = social_media.length > 0 ? ",instagram" : "instagram";
                    social_media += text;
                }
                if (formValue.step2.twitter) {
                    let text = "";
                    text = social_media.length > 0 ? ",twitter" : "twitter";
                    social_media += text;
                }
                let applicationPostObj = {
                    id: this.application.id,
                    camp_id: this.application.camp_id,
                    channel_id: formValue.step1.channel_id,
                    currency: formValue.step1.currency,
                    price: formValue.step1.price,
                    old_duration: formValue.step1.old_duration,
                    new_duration: formValue.step1.new_duration,
                    promotion_slot: formValue.step1.promotion_slot,
                    new_promotion_slot: formValue.step1.new_promotion_slot,
                    view_commitment: formValue.step2.view_commitment,
                    min_views: formValue.step2.min_views,
                    minor_changes: formValue.step2.minor_changes,
                    delivery_days: formValue.step2.delivery_days,
                    other_delivery_days: formValue.step2.other_delivery_days,
                    social_media_share: formValue.step2.social_media_share,
                    social_media: social_media,
                    privacy_policy: formValue.step2.privacyPolicy ? 1 : 0,
                    comment: formValue.step3.comment,
                    plateform_type:this.application.plateform_type
                }

                this._applicationsService.editApplication(applicationPostObj).subscribe(
                    data => {
                        this.alert = {
                            type: 'success',
                            message: 'Congratulations! Your application is successfullt updated.'
                        };
                        this._notifyService.showSuccess(data.message, "");
                        let payload={
                            "page":'1',
                            "perPage":'10',
                            "status":'',
                            'plateform_type':'1'
                        }
                        this._applicationsService.getApplications(payload).subscribe((result) => {
                            this._changeDetectorRef.markForCheck();
                        });
                        this._router.navigate(['/apps/applications']);
                    }, (error) => {
                        this.loading = false;
                        this.alert = {
                            type: 'error',
                            message: error
                        };
                        // this._notifyService.showError(error.message, "");

                        this._changeDetectorRef.markForCheck();
                    }
                );
            } else {
                this.loading = false;
                this._changeDetectorRef.markForCheck();
            }
        });

        // this._campaignsService.saveButtonClicked$.subscribe(buttonClicked => {
            this.nextStateRoute = this._campaignsService.getNextRouteSelectedBeforeSave();
            // if (buttonClicked === true) {
            //     // this.postCampaign("draft");
            //     console.log("nextStateRoute",this.nextStateRoute);
                
                this._router.navigate([this.nextStateRoute]);
            // } else if (buttonClicked === false) {
            //     // this.campaignForm.get('step1').get('camp_title').patchValue(null);
                this._router.navigate([this.nextStateRoute]);
                console.log("nextStateRoute",this.nextStateRoute);
        this.navigateToNextStep()
        //         return true;
        //     } 
        // });
    }
    nextStateRoute: string = null;
    navigateToNextStep() {
        let nextState = this.nextStateRoute ? this.nextStateRoute : '/apps/campaigns/all';
        this._router.navigate([nextState]);
    }

  

    checkQuotationPrice() {
        let price = this.applicationForm.value.step1.price;
        if (price == this.defaultPrice) {
            this.defaultPriceSelected = true;
        } else {
            this.defaultPriceSelected = false;
        }
    }

    setQuotationPrice(event) {
        if (event.checked) {
            this.applicationForm.patchValue({
                step1: {
                    price: this.defaultPrice
                }
            });
        } else {
            this.applicationForm.patchValue({
                step1: {
                    price: ''
                }
            });
        }
    }

    oldDurationSelection() {
        const newDuration = this.applicationForm.get("step1").get("new_duration");
        if (this.applicationForm.value.step1.old_duration === 0) {
            newDuration.setValidators([Validators.required]);
        } else {
            newDuration.setValidators(null);
        }
        newDuration.updateValueAndValidity();
    }

    promotionSlotSelection() {
        const newPromotionSlot = this.applicationForm.get("step1").get("new_promotion_slot");
        if (this.applicationForm.value.step1.promotion_slot === 0) {
            newPromotionSlot.setValidators([Validators.required]);
        } else {
            newPromotionSlot.setValidators(null);
        }
        newPromotionSlot.updateValueAndValidity();
    }

    viewCommitmentSelection() {
        const minViews = this.applicationForm.get("step2").get("min_views");
        if (this.applicationForm.value.step2.view_commitment === 1) {
            minViews.setValidators([Validators.required]);
        } else {
            minViews.setValidators(null);
        }
        minViews.updateValueAndValidity();
    }

    deliveryDaysSelection() {
        const otherDeliveryDays = this.applicationForm.get("step2").get("other_delivery_days");
        if (this.applicationForm.value.step2.delivery_days === "other") {
            otherDeliveryDays.setValidators([Validators.required]);
        } else {
            otherDeliveryDays.setValidators(null);
        }
        otherDeliveryDays.updateValueAndValidity();
    }

    socialMediaShareSelection() {
        const facebook = this.applicationForm.get("step2").get("facebook");
        const instagram = this.applicationForm.get("step2").get("instagram");
        const twitter = this.applicationForm.get("step2").get("twitter");
        if (this.applicationForm.value.step2.social_media_share === 1) {
            facebook.setValidators([Validators.required]);
            instagram.setValidators([Validators.required]);
            twitter.setValidators([Validators.required]);
        } else {
            facebook.setValue('');
            facebook.setValidators(null);
            instagram.setValue('');
            instagram.setValidators(null);
            twitter.setValue('');
            twitter.setValidators(null);
        }
        facebook.updateValueAndValidity();
        instagram.updateValueAndValidity();
        twitter.updateValueAndValidity();
    }

    socialOptionSelection(event) {
        const facebook = this.applicationForm.get("step2").get("facebook");
        const instagram = this.applicationForm.get("step2").get("instagram");
        const twitter = this.applicationForm.get("step2").get("twitter");
        if (facebook.value || instagram.value || twitter.value) {
            facebook.setValidators(null);
            instagram.setValidators(null);
            twitter.setValidators(null);
        } else {
            facebook.setValue('');
            facebook.setValidators([Validators.required]);
            instagram.setValue('');
            instagram.setValidators([Validators.required]);
            twitter.setValue('');
            twitter.setValidators([Validators.required]);
        }
        facebook.updateValueAndValidity();
        instagram.updateValueAndValidity();
        twitter.updateValueAndValidity();
    }
}
