import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy,ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { fromEvent, Observable, pipe, Subject } from 'rxjs';
import { filter, switchMap, takeUntil,tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';

import { BmiMediaWatcherService } from '@bmi/services/media-watcher';
import { Campaign } from 'app/modules/admin/apps/campaigns/campaigns.types';
import { UserService } from 'app/core/user/user.service';
import { CampaignsService } from 'app/modules/admin/apps/campaigns/campaigns.service';
import { isEmpty } from 'lodash';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DashboardService } from 'app/modules/admin/dashboard/dashboard.service';
import { ApplicationsService } from 'app/modules/admin/apps/applications/applications.service';
import { CampaignsAlertPopupComponent } from '../campaigns-alert-popup/campaigns-alert-popup.component';
import { ChannelService } from 'app/layout/common/channel/all-channels.service';
import { Pipe, PipeTransform } from '@angular/core';
import { NotificationService } from 'app/core/services/notification.service';

@Component({
    selector: 'campaigns-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})



export class CampaignsListComponent implements OnInit, OnDestroy {
    @ViewChild('campaignDrawer', { static: true }) matDrawer: MatDrawer;

    campaigns$: Observable<Campaign[]>;
    userType: string = '';

    contactsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
    drawerMode: 'side' | 'over';
    selectedCampaign: Campaign;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    pageSize = 10;
    currentPage = 0;
    lowValue: number = 5;
    highValue: number = 10;

    totalCampaignsCount: number = 0;
    totalCount: number = 0;
    allCampaignsCount: number = 0;
    liveCount: number = 0;
    invitedCount: number = 0;
    pendingCount: number = 0;
    rejectedCount: number = 0;
    draftCount: number = 0;
    allCount:any
    selectedTabIndex: number = 0;
    selectedTabValue: string = "";

    // Filter variables
    budgetFilter: string = "";
    subscriberFilter: string = "";
    keywordFilter: string = "";
    status: string = "1";
    data:any;
    channelList:any;
    pagination=true
    /**
     * Constructor
     */
    constructor(
        private _userService: UserService,
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _campaignsService: CampaignsService,
        private _applicationsService: ApplicationsService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: BmiMediaWatcherService,
        public dialog: MatDialog,
        private _dashboardService: DashboardService,
        private _channelService: ChannelService,
        private _notifyService: NotificationService,

    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.userType = this._userService.userDetails.userType.toUpperCase();
        this.selectedTabValue = this.userType === "BRAND" ? "" : "Live";
        // Get the camapigns
        this.campaigns$ = this._campaignsService.campaigns$.pipe(tap((res:any)=>{
        res.sort((a,b)=>{
                return a.updated_at < b.updated_at ? -1 : 1;
            });
            return res
        }));
        let payload = {
            "page": this.pageIndex +1,
            "perPage": this.pageSize,
            // "limit": this.pageSize,
            // "offset": this.currentPage * this.pageSize,
            "status": this.status,
            "plateform_type":this.filter

        }
        this._channelService.getChannels(payload).subscribe((data) => {
            this.channelList = data['payload'].channel_list;
            // this.data = data;
            // Execute the observable
            // this.totalChannels.next(this.channels.length);
            // this._changeDetectorRef.markForCheck();
        });

        this.callInitData();
        // this.getCampaignListData();
        // Get the campaign
        this._campaignsService.campaign$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((campaign: Campaign) => {

                // Update the selected campaign
                this.selectedCampaign = campaign;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                // Remove the selected campaign when drawer closed
                this.selectedCampaign = null;

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


          
            this._dashboardService.getDashboardData().subscribe((data:any)=>{
                if (data['payload']) {
                    // Store the data
                    this.data = data['payload'];         
                    // this.channelList = data['payload'].channel_list;         
                    // this.selectValue =this.data.channel_list[0].id
                    // console.log("selectValue",JSON.stringify( this.selectValue));
                    // console.log("sadiya",data)
                }                
            })
           
            // this.data=JSON.parse(sessionStorage.getItem('channelList')) 
            //             console.log("channelList",this.data);
                        
            this.planDetails = JSON.parse(sessionStorage.getItem('planDetail')) 

            console.log("liveCamp",this.planDetails);
    }

    planDetails:any

    selectValue:any
    select_Value(id){
        console.log("id",id)
        let payload = {
            // "limit": this.pageSize,
            // "offset": this.currentPage * this.pageSize,
            "page": this.pageIndex +1,
            "perPage": this.pageSize,
            "status": this.status,
            "channel_id":id,
            "plateform_type":this.filter
        }
        this._campaignsService.getCampaigns(payload).subscribe((data) => {
            this._changeDetectorRef.markForCheck();
    // this.callInitData();

        });

    }

    filterByChannels(event){
        console.log("event",event)
        
        let payload = {
            // "limit": this.pageSize,
            // "offset": this.currentPage * this.pageSize,
            "page": this.pageIndex +1,
            "perPage": this.pageSize,
            "status": this.status,
            "channel_id":event,
            "plateform_type":this.filter
        }
        this._campaignsService.getCampaigns(payload).subscribe((data) => {
            this._changeDetectorRef.markForCheck();
    // this.callInitData();

        });
        // this._campaignsService.getCampaigns(payload).subscribe();
        // this.callInitData();
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
          width: '350px',
        });
    
        dialogRef.afterClosed().subscribe(result => {
        //   console.log('The dialog was closed');
        });
      }

      planUpgradePopup(): void {
        const dialogRef = this.dialog.open(CampaignsAlertPopupComponent, {
          width: '350px',
          data:this.data
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      }

    postCampaign() {
        this._applicationsService.isPreviewMode(false);

        let userDetail = JSON.parse(localStorage.getItem('userDetails'))
        let plans = userDetail.plan_id;
        let user = userDetail.userType
        if(user == 'brand') { 
            if ((this.data.plan_id===1 || this.planDetails.campaigns === this.data.liveCampaignsCount ) &&
               ( this.data.plan_id===2 || this.planDetails.campaigns===  this.data.liveCampaignsCount) && (plans !=3)){
                this.planUpgradePopup()
                return;
            }
            if(plans == 3) {
                this._router.navigate(['/apps/campaigns/post'])
            }  else if(this.data.liveCampaignsCount <=2) {
                // alert('You need to upgrade your plan')
                this._router.navigate(['/apps/campaigns/post'])
            }  else {
                // this.openDialog()
                this._router.navigate(['/apps/campaigns/post'])
            }
        }else {
            this._router.navigate(['/apps/campaigns/post'])
        }
        
    }

    // @ViewChild('keywords-input') keywordsInput
    // @ViewChild('focus' ) tableInput
    // getPaginatorData(event: PageEvent): PageEvent {
    //     console.log("event",event)
    //     this.currentPage = event.pageIndex;
    //     this.pageSize = event.pageSize
    //     this.lowValue = event.pageIndex * event.pageSize;
    //     this.highValue = this.lowValue + event.pageSize;
      
    //     // setTimeout(() => this.tableInput.scrollTo(0,0));
    //     // setTimeout(() => this.tableInput.nativeElement.scrollIntoView({ behavior: 'smooth', block: "top" }));
    
    //     this.getCampaignListData();
    //     window.scrollTo(0,0)
    //     window.location
    //     return event;
    // }
   
filterStatus:any=''
    onChangePage(event) {
        console.log("event",event);
        this.pageSize=event.pageSize
        this.pageIndex = event.pageIndex;
        if(this.index===0){
            this.filterStatus=''
            this.getCampaignlistFromServer();
        }
        if(this.index===1){
            this.filterStatus='1'
            this.getCampaignlistFromServer();
        }
        if(this.index===2){
            this.filterStatus='0'
            this.getCampaignlistFromServer();
        }
        if(this.index===3){
            this.filterStatus='4'
            this.getCampaignlistFromServer();
        }
        if(this.index===4){
            this.filterStatus='3'
            this.getCampaignlistFromServer();
        }
        
        // this.getCampaignlistFromServer();
        this.currentPage = event.pageIndex;
        this.pageSize = event.pageSize
    }

    scroll(el: HTMLElement) {
        el.scrollIntoView({ behavior: 'smooth' });
    }

    transactions: any;
    campaigns: any;
    channels;
    pageIndex: number = 0;
    getCampaignlistFromServer() {
        this.transactions = [];
        let payload = {
            // "limit": this.pageSize,
            "page": this.pageIndex + 1,
            "perPage":  this.pageSize,
            "status":this.filterStatus,
            "plateform_type":this.filter
        }
        this._campaignsService.getCampaigns(payload).subscribe(responce=>{
            if (responce['success']) {
                this.campaigns = responce['payload'].campaign
                ;

                console.log("campaign",this.campaigns);
                console.log(" .reverse()campaign",this.campaigns.reverse());
                
                
            }

        })   
        window.scrollTo(0,0)

    }

    getCampaignListData() {

        let payload = {
            // "limit": this.pageSize,
            // "page": this.currentPage * this.pageSize,
            // "status": '',
            "page": this.pageIndex +1,
            "perPage": this.pageSize,
            "status": '',

        }
        // this._campaignsService.getCampaigns(payload).subscribe((data) => {
        //     this._changeDetectorRef.markForCheck();
        // });
        this._campaignsService.getCampaigns(payload).subscribe();
        this.callInitData();
    }

    callInitData() {
        // Get the campaignsCount
        this._campaignsService.totalCampaigns$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.totalCampaignsCount = count;
                this._changeDetectorRef.markForCheck();
            });
        this._campaignsService.totalCampaignsCount$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.totalCount = count;
                this._changeDetectorRef.markForCheck();
            });
        this._campaignsService.allCampaignsCount$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.allCampaignsCount = count;
                this._changeDetectorRef.markForCheck();
            });
        this._campaignsService.liveCampaignsCount$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.liveCount = count;
                this._changeDetectorRef.markForCheck();
            });
        this._campaignsService.invitedCampaignsCount$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.invitedCount = count;
                this._changeDetectorRef.markForCheck();
            });
        this._campaignsService.totalPendingCampaigns$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.pendingCount = count;
                this._changeDetectorRef.markForCheck();
            });
        this._campaignsService.totalRejectedCampaigns$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.rejectedCount = count;
                this._changeDetectorRef.markForCheck();
            });
        this._campaignsService.totalDraftCampaigns$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.draftCount = count;
                this._changeDetectorRef.markForCheck();
            });
    }
perPage:number=0
    filter:any='1'
    filterValue(event){
        this.filter =event
        // if(this.filter==='2'){
            let payload = {
                "page": this.perPage +1,
                "perPage": this.pageSize,
                // "limit": this.pageSize,
                // "offset": this.currentPage * this.pageSize,
                "status": this.status,
                "plateform_type":this.filter
    
            }
            this._channelService.getChannels(payload).subscribe((data) => {
                this.channelList = data['payload'].channel_list;
         } ) 
        // }
        let body = {
            "status": '',
            // "limit": "10",
            // "offset": "0"
            "page":'1',
            "perPage":'10',
            "plateform_type":this.filter
        };
        this._campaignsService.getCampaigns(body).subscribe((data) => {
            this._changeDetectorRef.markForCheck();
        });
        // this.getCampaignlistFromServer()
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
     * On backdrop clicked
     */
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    onApplyClick(campaign: Campaign): void {
        this._campaignsService.setPlateForm(campaign)
if(this.channelList.length > 0){
    this._router.navigate(['./', campaign.id], { relativeTo: this._activatedRoute });

}else{
    this._notifyService.showWarning("please add a channel",'warning')

}
    }

    // userIdentity = (i: number) => this.campaigns[this.campaigns.length - 1 - i];

    onEditClick(campaign: Campaign,type:any): void {
        console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",campaign);
        
        this._applicationsService.isPreviewMode(false);
        this._campaignsService.setPlateForm(campaign)
        this._router.navigate(['/apps/campaigns/post', campaign.id], { relativeTo: this._activatedRoute });
    }

    onPreViewClick(campaign: Campaign): void {
       
        console.log("campaign",campaign);
        
        this._applicationsService.isPreviewMode(true);
// this._applicationsService.setPlateform(campaign)

        this._router.navigate(['/apps/campaigns/post', campaign.id], { relativeTo: this._activatedRoute });
    }

    onResponseClick(campaign: Campaign): void {
        this._router.navigate(['/apps/campaigns/responses', campaign.id], { relativeTo: this._activatedRoute });
    }
index=0
    onTabChanged(event: any,label) {
        console.log("event",event,"label",label);
        this.index= event.index
        this.selectedTabIndex = event.index;
        this.selectedTabValue = event.tab.textLabel.split(" ")[0];
        console.log("selectedTabValue",this.selectedTabValue.split('(')[0]);
        this.currentPage=0
        if (event.index === 0) {
            this.status = event
            this.status = this.userType === "BRAND" ||this.userType === "INFLUENCER" ? "" : "1";
            let body = {
                "status": this.status,
                // "limit": "10",
                // "offset": "0"
                "page":'1',
                "perPage":'10',
                "plateform_type":this.filter
            };
            this._campaignsService.getCampaigns(body).subscribe((data) => {
                this._changeDetectorRef.markForCheck();
            });
        } else if (event.index === 1) {
            // For Brand, index = 1 is LIVE.
            // For Influecer, index = 2 is INVITED
            this.status = this.userType === "BRAND" || this.userType === "INFLUENCER" ? "1" : "2";
            let body = {
                "status": this.status,
                // "limit": "10",
                // "offset": "0"
                "page":'1',
                "perPage":'10',
                "plateform_type":this.filter

            };
            this._campaignsService.getCampaigns(body).subscribe((data) => {
                this._changeDetectorRef.markForCheck();
            });
        } else if (event.index === 2) {
            if(this.userType === "BRAND"){
                this.status = "0";
                let body = {
                    "status": this.status,
                    "perPage": "10",
                    "page": "1",
                "plateform_type":this.filter

                    // "limit": "10",
                    // "offset": "0"
                };
                this._campaignsService.getCampaigns(body).subscribe((data) => {
                    this._changeDetectorRef.markForCheck();
                });
            }else{
                this.status = "2";
                let body = {
                    "status": this.status,
                    "perPage": "10",
                    "page": "1",
                "plateform_type":this.filter

                    // "limit": "30",
                    // "offset": "0"
                };
                this._campaignsService.getCampaigns(body).subscribe((data) => {
                    this._changeDetectorRef.markForCheck();
                });
            }
           
        } 
        else if (event.index === 3) {
            this.status = "4";
            let body = {
                "status": this.status,
                "perPage": "10",
                "page": "1",
                "plateform_type":this.filter
                
                // "limit": "10",
                // "offset": "0"
            };
            this._campaignsService.getCampaigns(body).subscribe((data) => {
                this._changeDetectorRef.markForCheck();
                console.log(" this._changeDetectorRef.markForCheck();", this._changeDetectorRef.markForCheck())
            });
        }
        else if (event.index === 4) {
            this.status = "3";
            let body = {
                "status": this.status,
                // "limit": "10",
                // "offset": "0"
                "perPage": "10",
                "page": "1",
                "plateform_type":this.filter

            };
          this._campaignsService.getDrafts(body).subscribe(res=>{
            console.log("res",res)
            console.log(" this._changeDetectorRef.markForCheck();", this._changeDetectorRef.markForCheck())
            this.drafts = res.payload.campaign
            console.log("drafts",this.drafts)
          })
        }
    }
drafts:any=[]
    applyFilter() {
        let payload = {
            "search_keyword": this.keywordFilter,
            "subscriber": this.subscriberFilter,
            "average_view": "",
            "budget": this.budgetFilter,
            "engagement_rate": "",
            "status": this.status,
            "plateform_type":this.filter

        }
 
        this._campaignsService.getCampaigns(payload).subscribe((data) => {
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Filter by budget
     *
     * @param change
     */
    filterByBudget(change: MatSelectChange): void {
        this.budgetFilter = change.value;
    }

    /**
     * Filter by subscribers
     *
     * @param change
     */
    filterBySubscribers(change: MatSelectChange): void {
        this.subscriberFilter = change.value;
    }

    filterByKeyword(query: string): void {
        this.keywordFilter = query;
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
@Component({
    selector: 'dialog-overview-example-dialog',
    template: `
    <div mat-dialog-content>
      <p style="text-align: center;
      margin-top: 4px;
      font-weight:bold;
      font-size: 18px;">Yor exceed live campaign limit. You need to upgrade your plan</p>
 
    </div>
    <div mat-dialog-actions style="text-align:center">
      <button type="button" class="btn btn-danger mt-3" (click)="onNoClick()">Ok</button>
    </div>`,
  })

  export class DialogOverviewExampleDialog {
    constructor(
      public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
      @Inject(MAT_DIALOG_DATA) public data,
    ) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }