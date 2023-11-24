import { ChangeDetectionStrategy, ChangeDetectorRef,Input, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash-es';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { BmiAlertType } from '@bmi/components/alert';
import { bmiAnimations } from '@bmi/animations';
import { UserService } from 'app/core/user/user.service';
import { Campaign } from 'app/modules/admin/apps/campaigns/campaigns.types';
import { CampaignsListComponent } from 'app/modules/admin/apps/campaigns/list/list.component';
import { CampaignsService } from 'app/modules/admin/apps/campaigns/campaigns.service';
import { PaymentGuidelinesPopupComponent } from 'app/layout/common/payment-guidelines-popup/payment-guidelines-popup.component';
import { Channel } from 'app/layout/common/channel/all-channels.types';
import { NotificationService } from 'app/core/services/notification.service';
import { BmiConfirmationService } from '@bmi/services/confirmation';
import { VerifyChannelPopupComponent } from 'app/layout/common/verify-channel-popup/verify-channel-popup.component';
import { ChannelService } from 'app/layout/common/channel/all-channels.service';

@Component({
    selector: 'campaigns-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: bmiAnimations
})
export class CampaignsDetailsComponent implements OnInit, OnDestroy {
   
    reviewMode: boolean = false;
    campaign: Campaign;
    contacts: Campaign[];
    channelList: Channel[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    verifyCheckForm: FormGroup;

    applicationForm: FormGroup;
    defaultPrice: number = 0;
    defaultPriceSelected: boolean = false;
    stepperOrientation: Observable<StepperOrientation>;
    selectedChannelName: string;
    selectedChannel: Channel;
    loading = false;
    alert: { type: BmiAlertType; message: string } = {
        type: 'success',
        message: null
    };
    commentPlaceHolder = "Campaign Resource document\n" +
        " - Any specific instructions as to how the brand should be presented in promo time slot\n" +
        " - How brand wants his 'promotion part' to look/sound like\n" +
        " - What to speak about the brand such as list of features \n" +
        " - Any “Template script“ to refer or stick to\n" +
        " - Suggestions on the video concept/script ideas";

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _campaignsListComponent: CampaignsListComponent,
        private _campaignsService: CampaignsService,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _router: Router,
        private _userService: UserService,
        breakpointObserver: BreakpointObserver,
        private _notifyService: NotificationService,
        private _channelService: ChannelService,

        private _bmiConfirmationService: BmiConfirmationService
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
    userDetails:any
    filter:any='1'
    ngOnInit(): void {
        // Open the drawer
    // if(!this.channelList.length){
    //     this._notifyService.showWarning("please add a channel",'warning')
    // }
        this.camData =this._userService.getData()
        this.userDetails =this._userService.userDetails
        console.log("this.cam", this.camData);
        console.log("this.userDetails", this.userDetails);
        // localStorage.setItem('campDetails', JSON.stringify(this.camData))
        // sessionStorage.setItem('campDetails', JSON.stringify(this.camData))
       this.camData=JSON.parse(localStorage.getItem('campDetails')) 
        console.log("campDetails", this.camData);
        if(this.camData.plateform==='instagram'){
            this.filter ='2'
            let payload = {
                "page": '1',
                "perPage": '10',
                // "limit": this.pageSize,
                // "offset": this.currentPage * this.pageSize,
                "status": '',
                "plateform_type":'2'
    
            }
            this._channelService.getChannels(payload).subscribe((data) => {
                this.channelList = data['payload'].channel_list.filter(res=>res.is_verified===1);
        this.createApplicationForm();

         } ) 
        }else{
            let payload = {
                "page": '1',
                "perPage": '10',
                // "limit": this.pageSize,
                // "offset": this.currentPage * this.pageSize,
                "status": '',
                "plateform_type":'1'
    
            }
            this._channelService.getChannels(payload).subscribe((data) => {
                this.channelList = data['payload'].channel_list.filter(res=>res.is_verified===1);
                this.createApplicationForm();

         } ) 
        }

        this._campaignsListComponent.matDrawer.open();

        // Get the contacts
        this._campaignsService.campaigns$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contacts: Campaign[]) => {
                this.contacts = contacts;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the campaign
        this._campaignsService.campaign$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((campaign: Campaign) => {

                // Open the drawer in case it is closed
                this._campaignsListComponent.matDrawer.open();

                // Get the campaign
                this.campaign = campaign;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the channels
        this._campaignsService.channels$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((channels: Channel[]) => {
                console.log("channels",channels);
                
                // this.channelList = channels.filter(channel => channel.title !== "");
                this.channelList = channels.filter(channel => channel.is_verified == 1);
                console.log("channelList 119",this.channelList);
                this.selectedChannelName = this.channelList[0].title
        this.userName = this.channelList[0];

        console.log("selectedChannelName",this.selectedChannelName);


                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this.createApplicationForm();
    }

    nextStep(){
        // alert("hello")
        console.log("applicationForm",this.applicationForm)
        // this.createApplicationForm()
        this.applicationForm.get('step1').get('currency').setValue(this.userDetails.currency)
        // this.applicationForm.get('step1').setValue(this.userDetails.currency)
      
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
        return this._campaignsListComponent.matDrawer.close();
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
        return index;
    }

    createApplicationForm() {
        let default_channel = this.channelList.filter(channel => channel.is_default === 1);
        let selected = 0;
        console.log(default_channel.length,default_channel,'channel');
        
        if(default_channel.length > 0) {
            selected = default_channel[0].id;
            this.channelSelected(selected);
        }
        console.log(this.channelList,'listtt');
        let selectedChannel:any;
        if(this.channelList.length > 0) {
            selectedChannel = this.channelList[0].id
            this.defaultPrice = this.channelList[0].promotion_price
        console.log(this.defaultPrice,'defaultPrice');

        }
        this.applicationForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                channel_id: [this.channelList[0].id, [Validators.required]],
                // channel_id: [selected == 0 ? selectedChannel : "", [Validators.required]],
                currency: ['INR', [Validators.required]],
                price: ['', [Validators.required]],
                old_duration: [''],
                new_duration: [''],
                new_other_duration: [''],
                promotion_slot: [''],
                new_promotion_slot: ['']
            }),
            step2: this._formBuilder.group({
                view_commitment: ['', ],
                min_views: [''],
                minor_changes: ['', Validators.required],
                delivery_days: ['', Validators.required],
                other_delivery_days: ['',Validators.required],
                social_media_share: ['', Validators.required],
                facebook: [''],
                instagram: [''],
                twitter: [''],
                privacyPolicy: [true, Validators.required]
            }),
            step3: this._formBuilder.group({
                comment: ['']
            })
        });
    }

    backFromPreview() {
        this.reviewMode = false;
    }

    userName:any
    channelSelected(selection: number) {
        this.selectedChannel = this.channelList.filter(channel => channel.id === selection)[0];
        console.log("selectedChannel",this.selectedChannel)
        // this.selectedChannelName = this.selectedChannel.title;
        // this.selectedChannelName = this.selectedChannel.username;
        this.userName = this.selectedChannel;

        console.log("userName",this.userName);
        console.log("selectedChannelName",this.selectedChannelName);
        
        this.defaultPrice = this.selectedChannel.promotion_price;

    }

    checkChannel() {
        // if (!this.checkForChannelVerification()) {
        //     return;
        // } else {
            this.applyCampaign();
        // }
    }

    applyCampaign() {
        if (this.applicationForm.invalid) {
            return;
        }
        this.loading = true;

        let campaignApplicationForm: Campaign;
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
                let campaignPostObj = {
                    camp_id: this.campaign.id,
                    channel_id: formValue.step1.channel_id,
                    currency: formValue.step1.currency,
                    price: formValue.step1.price,
                    old_duration: formValue.step1.old_duration,
                    new_duration: formValue.step1.new_duration !== 'other' ? formValue.step1.new_duration : formValue.step1.new_other_duration,
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
                    // platform:this.campaign.plateform,
                    plateform_type:this.filter,
                   
                }

                this._campaignsService.applyCampaign(campaignPostObj).subscribe(
                    data => {
                        this.alert = {
                            type: 'success',
                            message: 'Congratulations! You have applied for this campaign.'
                        };
                        this._notifyService.showSuccess(data.message, "");
                        this._campaignsService.getCampaigns().subscribe((result) => {
                            this._changeDetectorRef.markForCheck();
                        });
                        this._router.navigateByUrl('/apps/applications');
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
    }

    // checkForChannelVerification() {
    //     let isVerified = false;
    //     console.log("selectedChannel",this.selectedChannel);
        
    //     if (!this.selectedChannel) {
    //         isVerified = false;
    //         // ask user to verfiy channel
    //         this.verifyCheckForm = this._formBuilder.group({
    //             title: 'Channel (' + this.selectedChannelName + ') is Not Verified',
    //             message: 'Please verify your channel before applying campaign',
    //             icon: this._formBuilder.group({
    //                 show: true,
    //                 name: 'heroicons_outline:exclamation',
    //                 color: 'warn'
    //             }),
    //             actions: this._formBuilder.group({
    //                 confirm: this._formBuilder.group({
    //                     show: true,
    //                     label: 'Yes, Proceed',
    //                     color: 'success'
    //                 }),
    //                 cancel: this._formBuilder.group({
    //                     show: true,
    //                     label: 'Cancel'
    //                 })
    //             }),
    //             dismissible: false
    //         });

    //         const verifyCheckDialogRef = this._bmiConfirmationService.open(this.verifyCheckForm.value);
    //         verifyCheckDialogRef.afterClosed().subscribe((result) => {
    //             if (result === "confirmed") {
    //                 // show verfiy channel popup
    //                 this.verifyInfChannel();
    //             } else {
    //                 // Navigate to campaigns page
    //                 this.reviewMode = false;
    //                 this._changeDetectorRef.markForCheck();
    //                 this._router.navigate(['../'], { relativeTo: this._activatedRoute });
    //             }
    //         });
    //     } else {
    //         isVerified = true;
    //     }
    //     return isVerified;
    // }

    verifyInfChannel() {
        const verifyChannelPopup = this._matDialog.open(VerifyChannelPopupComponent, {
            maxHeight: '95vh',
            width: '80vw',
            autoFocus: true,
            disableClose: true,
            data: {
                channel: this.selectedChannel
            }
        });

        verifyChannelPopup.afterClosed().subscribe(response => {
            if (response.success) {
                this.applyCampaign();
            }
        });
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
            console.log("this.applicationForm.value.step1.price",this.applicationForm.value.step1.price);
            
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
        if (this.applicationForm.value.step1.old_duration === "0") {
            newDuration.setValidators([Validators.required]);
        } else {
            newDuration.setValidators(null);
        }
        newDuration.updateValueAndValidity();
    }

    newDurationSelection() {
        const newOtherDuration = this.applicationForm.get("step1").get("new_other_duration");
        if (this.applicationForm.value.step1.old_duration === "0" && this.applicationForm.value.step1.new_duration === 'other') {
            newOtherDuration.setValidators([Validators.required]);
        } else {
            newOtherDuration.setValidators(null);
        }
        newOtherDuration.updateValueAndValidity();
    }

    promotionSlotSelection() {
        const newPromotionSlot = this.applicationForm.get("step1").get("new_promotion_slot");
        if (this.applicationForm.value.step1.promotion_slot === "0") {
            newPromotionSlot.setValidators([Validators.required]);
        } else {
            newPromotionSlot.setValidators(null);
        }
        newPromotionSlot.updateValueAndValidity();
    }

    viewCommitmentSelection() {
        const minViews = this.applicationForm.get("step2").get("min_views");
        if (this.applicationForm.value.step2.view_commitment === "1") {
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
        if (this.applicationForm.value.step2.social_media_share === "1") {
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
