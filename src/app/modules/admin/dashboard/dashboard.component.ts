import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    ViewChild,
    Inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { DashboardService } from 'app/modules/admin/dashboard/dashboard.service';
import { UserService } from 'app/core/user/user.service';
import { InformationReviewPopupComponent } from 'app/layout/common/information-review-popup/information-review-popup.component';
import { InfluencerWelcomePopupComponent } from 'app/layout/common/influencer-welcome-popup/influencer-welcome-popup.component';
import { VerifyChannelPopupComponent } from 'app/layout/common/verify-channel-popup/verify-channel-popup.component';
import { UpdateCategoryPopupComponent } from 'app/layout/common/update-category-popup/update-category-popup.component';
import { NotificationService } from 'app/core/services/notification.service';
import { CampaignsAlertPopupComponent } from '../apps/campaigns/campaigns-alert-popup/campaigns-alert-popup.component';
import { CampaignsService } from '../apps/campaigns/campaigns.service';
import { PageEvent } from '@angular/material/paginator';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { ChannelService } from 'app/layout/common/channel/all-channels.service';
import { AuthService } from 'app/core/auth/auth.service';
@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {
    data: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    userDetails: any;
    userType: string = 'INFLUENCER';
    recommendedChannels: any = [];
    loadmorerecommendedChannels: any = [];
    userName: any = '';
    filter='1'
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _dashboardService: DashboardService,
        private _router: Router,
        private _matDialog: MatDialog,
        private _userService: UserService,
        private _navigationService: NavigationService,
        private _notifyService: NotificationService,
        public dialog: MatDialog,
        private _campaignService: CampaignsService,
        private _channelService: ChannelService,
        private _authService: AuthService,

    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    planDetails: any;
    ngOnInit(): void {
        this.userDetails = this._userService.userDetails;
        console.log('userDetails', this.userDetails);
        // this.reviewInformation();

        this.userType = this.userDetails.userType.toUpperCase();
        let UserName = JSON.parse(localStorage.getItem('userName'));
        let name = UserName?.split(' ');
        if (name) {
            this.userName = name[0];
        }
        let payload={
            "email":this.userDetails.email
        }
        this._authService.getUserInfo(payload).subscribe(res=>{
            localStorage.setItem('relationship_manager', JSON.stringify(res['payload'].relationship_manager))
            console.log("res",res['payload'].relationship_manager);
            
            // localStorage.setItem("relationshipManager",JSON.stringify(res.relationship_manager))
        })
        //    else{
        //     let userName= JSON.parse(localStorage.getItem('userDetails'));
        //    let name= userName?.fullname?.split(' ')
        //     this.userName = name[0]
        //    }
        // Get the data
        this._dashboardService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                if (data['payload']) {
                    // Store the data
                    this.data = data['payload'];
                    console.log('this.data', this.data);
                    sessionStorage.setItem(
                        'channelList',
                        JSON.stringify(this.data.channel_list)
                    );
                    
                    
                    let userName = data['payload'];
                    let name = userName?.fullname?.split(' ');
                    this.userName = name[0];

                    if (this.data.is_login_first_time) {
                        if (this.userType === 'INFLUENCER') {
                            this.reviewInformation();
                        }
                    }
                    if (this.userType === 'BRAND') {
                        if (!this.data.plan_id) {
                            this._router.navigateByUrl('/choose-plan');
                        } else if (!this.data.category_preferences) {
                            this.updateCategory();
                        }
                    }
                    if (
                        this.userType === 'INFLUENCER' &&
                        data['payload']?.default_channel &&
                        data['payload']?.default_channel.image
                    ) {
                        this._userService.updateUserDetailsInLocalStorage(
                            'profile_photo',
                            data['payload']?.default_channel.image
                        );
                    }

                    if (this.userType === 'BRAND') {
                        let payload = {
                            perPage: '10',
                            page: '',
                            plateform_type:this.filter
                            // "limit": 5,
                            // "offset": "",
                        };

                        this._dashboardService
                            .recommendedInfluencers(payload)
                            .subscribe((responce) => {
                                this.recommendedChannels =
                                    responce.payload.channel_list;
                                this.count = responce.payload.last_page;
                                console.log(
                                    'recommendedChannels',
                                    this.recommendedChannels
                                );
                                this._changeDetectorRef.markForCheck();
                            });
                        // this.recommendedChannels = this.data.channel_list;
                        this._changeDetectorRef.markForCheck();
                    }
                }
            });
     
        this.planDetails = JSON.parse(sessionStorage?.getItem('planDetail')) 

        console.log("liveCamp",this.planDetails);

    }
    count: any;
    openDialog(): void {
        const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
            width: '350px',
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
        });
    }

    planUpgradePopup(): void {
        const dialogRef = this.dialog.open(CampaignsAlertPopupComponent, {
            width: '350px',
            data: this.data,
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
        });
    }

    postCampaign() {
        let userDetail = JSON.parse(localStorage.getItem('userDetails'));
        console.log('userDetails', userDetail);
        console.log('this.data', this.data);
        let plans = userDetail.plan_id;
        let user = userDetail.userType;
        if (user == 'brand') {
            console.log('data', this.data);

            if 
                ((this.data.plan_id===1 || this.planDetails.campaigns === this.data.liveCampaignsCount ) &&
                    (this.data.plan_id===2 || this.planDetails.campaigns===  this.data.liveCampaignsCount) && (plans !=3) ) {
                this.planUpgradePopup();
                // return;
            } else if (plans === 3) {
                this._router.navigate(['/apps/campaigns/post']);
            } else if (this.data.liveCampaignsCount <= 2) {
                // alert('You need to upgrade your plan')
                this._router.navigate(['/apps/campaigns/post']);
            } else {
                this.openDialog();
            }
        } else {
            this._router.navigate(['/apps/campaigns/post']);
        }
    }
    
    reviewInformation() {
        let userInfo = {
            fullname: this.userDetails.fullname,
            email: this.userDetails.email,
            phone: this.userDetails.phone,
            country_id: this.userDetails.country_id,
            channel_name: this.data?.default_channel?.channel_name,
            canonical_name: this.data?.default_channel?.canonical_name,
            channel_vanity: this.data?.default_channel?.channel,
            language: this.data?.default_channel?.channel_lang,
            currency: this.data?.default_channel?.currency,
            video_promotion_price: this.data?.default_channel?.promotion_price,
        };

        const infoReviewPopup = this._matDialog.open(
            InformationReviewPopupComponent,
            {
                maxHeight: '100vh',
                autoFocus: true,
                disableClose: true,
                data: {
                    user: userInfo,
                },
            }
        );

        infoReviewPopup.afterClosed().subscribe((result) => {
            if (result) {
                // Information Form looks good or updated
                // Open Welcome popup
                const welcomePopup = this._matDialog.open(
                    InfluencerWelcomePopupComponent,
                    {
                        maxHeight: '100vh',
                        autoFocus: true,
                        disableClose: true,
                    }
                );

                welcomePopup.afterClosed().subscribe((response) => {
                    if (response) {
                        // Verify Channel popup open

                        this.verifyChannel();
                    }
                    window.location.reload();
                });
            }
        });
    }

    verifyChannel() {
        const verifyChannelPopup = this._matDialog.open(
            VerifyChannelPopupComponent,
            {
                maxHeight: '95vh',
                width: '80vw',
                autoFocus: true,
                disableClose: true,
                data: {
                    channel: this.data?.default_channel,
                },
            }
        );

        verifyChannelPopup.afterClosed().subscribe((response) => {
            if (response.success) {
                // Verify Channel popup closed, Update the UI
                if (this.data?.default_channel.id === response.payload.id) {
                    this.data.default_channel.is_verified = 1;
                    this.data.unverifiedChannelCound--;
                }
                this._notifyService.showSuccess(response.message, '');
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    updateCategory() {
        const updateCategoryPopup = this._matDialog.open(
            UpdateCategoryPopupComponent,
            {
                maxHeight: '95vh',
                maxWidth: '80vw',
                autoFocus: true,
                disableClose: true,
                data: {
                    preferences:
                        this._userService.userDetails.category_preferences,
                },
            }
        );

        updateCategoryPopup.afterClosed().subscribe((response) => {
            if (response) {
                console.log('response', response);

                this._router.navigateByUrl(response);
                if (response === '/dashboard') {
                    this.refreshRecommendedChannels();
                }
            }
        });
    }

    channelDeleted(event) {
        const indx = this.data.channel_list.findIndex((v) => v.id === event);
        this.data.channel_list.splice(indx, indx >= 0 ? 1 : 0);
    }

    channelRevealed(event) {
        console.log("event",event);
        
        // this.data.revealedChannelsCount = this.data.revealedChannelsCount + 1;
    }

    defaultChannelChanged(event) {
        this.data.channel_list.forEach((element) => {
            element.is_default = 0;
            if (element.id === event) {
                element.is_default = 1;
                this.data.default_channel.image = element.profile_pic;
            }
        });
        this._changeDetectorRef.markForCheck();
    }
    currentPage = 0;
    paginator = false;
    refreshRecommendedChannels() {
        let payload = {
            perPage: this.pageSize,
            page: this.currentPage++,
            // "limit": 5,
            // "offset": "",
            plateform_type:this.filter,

            search_keyword: this._userService.userDetails.category_preferences,
        };
        this._dashboardService
            .recommendedInfluencers(payload)
            .subscribe((data) => {
                if (data.success) {
                    this.recommendedChannels = data.payload.channel_list;
                    console.log(
                        'this.recommendedChannels',
                        this.recommendedChannels
                    );
                    this._changeDetectorRef.markForCheck();
                }
            });
    }

    pageSize = 10;
    // currentPage = 0;
    totalCampaignsCount: number = 0;
    lowValue: number = 0;

    highValue: number = 5;

    onChangePage(event) {
        console.log('event', event);

        this.pageIndex = event.pageIndex;
        this.getrecommendedlistFromServer();
        this.currentPage = event.pageIndex;
        this.pageSize = event.pageSize;
    }

    scroll(el: HTMLElement) {
        el.scrollIntoView({ behavior: 'smooth' });
    }

    pageIndex: number = 0;
    getrecommendedlistFromServer() {
        let payload = {
            // "limit": this.pageSize,
            page: this.pageIndex + 1,
            perPage: this.pageSize,
            plateform_type:this.filter

        };
       

        this._dashboardService
            .recommendedInfluencers(payload)
            .subscribe((responce) => {
                if (responce['success']) {
                    this.recommendedChannels = responce['payload'].channel_list;
                    console.log(
                        'recommendedChannels',
                        this.recommendedChannels
                    );
                    this._changeDetectorRef.markForCheck();
                }
            });
        window.scrollTo(0, 0);
    }

    // @ViewChild('focus', { read: ElementRef }) tableInput: ElementRef;
    // getPaginatorData(event: PageEvent): PageEvent {
    //     console.log("event",event)
    //     this.currentPage = event.pageIndex;
    //     this.pageSize = event.pageSize
    //     this.lowValue = event.pageIndex * event.pageSize;
    //     this.highValue = this.lowValue + event.pageSize;

    //     setTimeout(() => this.tableInput.nativeElement.scrollIntoView({ behavior: 'smooth', block: "top" }));

    //     this.getCampaignListData();
    //     window.scrollTo(0,0)
    //     window.location
    //     return event;
    // }
    status: string = '1';
    getCampaignListData() {
        let payload = {
            perPage: this.pageSize,
            page: this.currentPage + 1,
            // "limit": this.pageSize,
            // "offset": this.currentPage * this.pageSize,
            status: this.status,
        };
      
        this._campaignService.getCampaigns(payload).subscribe();
        // this.callInitData();
    }

    
    channelList:any
    filterValue(event){
        this.filter =event
        // if(this.filter==='2'){
            let payload = {
                "page": this.pageIndex +1,
                "perPage": this.pageSize,
                // "limit": this.pageSize,
                // "offset": this.currentPage * this.pageSize,
                "status": this.status,
                "plateform_type":this.filter
    
            }
            this._channelService.getChannels(payload).subscribe((data) => {
                // this.channelList = data['payload'].channel_list;
                this.recommendedChannels = data['payload'].channel_list;
                this._changeDetectorRef.markForCheck();

         } ) 
        // }
        // this.getCampaignlistFromServer()
    }

    // loadmoreRecommendedChannels() {
    //     let payload = {
    //         "page": '',
    //         "perPage": '',
    //         // "limit": 10,
    //         // "offset": 10,
    //         "search_keyword": ""
    //     };
    //     this._dashboardService.recommendedInfluencers(payload).subscribe(data => {
    //         if (data.success) {
    //             this.loadmorerecommendedChannels = data.payload.channel_list;
    //             let saprate= this.loadmorerecommendedChannels.filter(res=>{
    //                 console.log("res",res)
    //                 this.recommendedChannels.push(res)
    //                 console.log("this.loadmorerecommendedChannels",this.loadmorerecommendedChannels)
    //                 console.log("this.recommendedChannels",this.recommendedChannels)
    //                 this._changeDetectorRef.markForCheck();
    //             })

    //         }
    //     })
    // }

    goToAddChannel() {
        this._router.navigate(['/pages/add-channel'], {
            fragment: 'addChannel',
        });
    }

    goAddChannel() {
        this._router.navigate(['/pages/add-channel']);
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
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}

@Component({
    selector: 'dialog-overview-example-dialog',
    template: ` <div mat-dialog-content>
            <p
                style="text-align: center;
      margin-top: 4px;
      font-weight:bold;
      font-size: 18px;"
            >
                Yor exceed live campaign limit.You need to upgrade your plan
            </p>
        </div>
        <div mat-dialog-actions style="text-align:center">
            <button
                type="button"
                class="btn btn-danger mt-3"
                (click)="onNoClick()"
            >
                Ok
            </button>
        </div>`,
})
export class DialogOverviewExampleDialog {
    constructor(
        public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
        @Inject(MAT_DIALOG_DATA) public data
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}
