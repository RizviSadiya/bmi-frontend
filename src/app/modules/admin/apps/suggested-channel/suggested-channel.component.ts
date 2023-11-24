import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy,ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { fromEvent, Observable, Subject } from 'rxjs';
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
import { RevealedChannelsService } from '../revealed-channels/revealed-channels.service';
// import { CampaignsAlertPopupComponent } from '../campaigns-alert-popup/campaigns-alert-popup.component';
@Component({
  selector: 'app-suggested-channel',
  templateUrl: './suggested-channel.component.html',
  styleUrls: ['./suggested-channel.component.scss']
})
export class SuggestedChannelComponent implements OnInit {
  @ViewChild('campaignDrawer', { static: true }) matDrawer: MatDrawer;

//   campaigns$: Observable<Campaign[]>;
  channels$: Observable<any[]>;
  userType: string = '';

  contactsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
  drawerMode: 'side' | 'over';
  selectedCampaign: Campaign;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  pageSize = 10;
  currentPage = 0;
  lowValue: number = 0;
  highValue: number = 5;

  totalCampaignsCount: number = 0;
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
  totalChannels: number = 0;
  suggestedtotalChannels: number = 0;
  loading: boolean = true;
  
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
      private _channelService: RevealedChannelsService,
      private _campaignService: CampaignsService,
    //   private _userService: UserService,

  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
   category
   pagination=false
  ngOnInit(): void {
   this.category = this._userService.getinviteList();
   this.category = this._campaignsService.getSimilardata();
   this.category = JSON.parse(localStorage.getItem('category'));

    console.log("category",this.category);
    this.invitedCount =  this.category.inviteCount;
    this._changeDetectorRef.markForCheck();
this.getCampaignListData()
    // this.invitedCount =  this.category.invite_only;
  
      // Subscribe to media changes
    
        //   this.getsimilarData()
        let payload 
        if(this.category.plateform_type===2){
          payload = {
            "search_keyword":this.category.category.toString(),
              "page":this.similarpageIndex+1,
              "perPage":this.pageSize,
              "plateform_type":this.category.plateform_type,
              "followers":this.category.followers,
              "inf_score":this.category.inf_score
        }
        }else{
          payload = {
            "search_keyword":this.category.category.toString(),
            "average_view":this.category.average_view,
            "engagement_rate":this.category.engagement_rate,
            "subscriber":this.category.subscriber,
              "page":this.similarpageIndex+1,
              "perPage":this.pageSize,
              "plateform_type":this.category.plateform_type,
             
        }
     
        }
       
        this._channelService.getshowSimilarChannels(payload).subscribe();
        this.callInitData();
        this._campaignService.revealdChannel(payload).subscribe(res=>{
          this.revealdChannel = res.payload.revealedchannels
          // this.revealdChannel = res.payload.instachannels
          console.log("instachannels",this.revealdChannel);
          this._changeDetectorRef.markForCheck();
    
        this.callInitData();
  })
  }

  campaigns:any
  getCampaignListData() {

    let payload = {
      "status": "1",
      "page": "1",
      "perPage": "10",
      "plateform_type":this.category.plateform_type

  };
  this._campaignService.getCampaigns(payload).subscribe(data => {
      this.campaigns = data['payload'].campaign;
      console.log("campaigns",this.campaigns);
  for (let index = 0; index < this.campaigns.length; index++) {
    const element = this.campaigns[index];
    if(element.id === this.category.id){
      this.invitedCount = element.inviteCount
      console.log("count",this.invitedCount);
      
    }
  }
      this._changeDetectorRef.markForCheck();
    
  });
  }


  onChangeSimilarPage(event) {
    console.log("event",event);
    
    this.similarpageIndex = event.pageIndex;
    // this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize
    this.getSimilarlistFromServer();

}

scroll(el: HTMLElement) {
  el.scrollIntoView({ behavior: 'smooth' });
}

  onChangeRevealPage(event) {
    console.log("event",event);
    
    this.revealpageIndex = event.pageIndex;
    this.getReveallistFromServer();
    // this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize
}

onChangeInvitePage(event) {
    console.log("event",event);
    
    this.invitepageIndex = event.pageIndex;
    this.getInvitelistFromServer();
    // this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize
}

gotoTop() {
    alert("hello")
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }

transactions: any;
channels;
invitepageIndex: number = 0;
similarpageIndex: number = 0;
revealpageIndex: number = 0;
// currentPage = 0;
// pageSize = 10;
getSimilarlistFromServer() {
    this.transactions = [];
    let payload = {
        // "limit": this.pageSize,
        "search_keyword":this.category.category.toString(),
        "average_view":this.category.average_view,
        "engagement_rate":this.category.engagement_rate,
        "subscriber":this.category.subscriber,
        "page": this.similarpageIndex + 1,
        "perPage":  this.pageSize,
        "plateform_type":this.category.plateform_type


    }
    this._channelService.getshowSimilarChannels(payload).subscribe(responce=>{
        if (responce['success']) {
            this.channels = responce['payload'].channels;
            
            console.log("channels",this.channels);
            
        }

    })   
    window.scrollTo(0,0)

}

getReveallistFromServer() {
    this.transactions = [];
    let payload = {
      "page": this.revealpageIndex +1,
      "perPage": this.pageSize,
      "plateform_type":this.category.plateform_type ,
      "search_keyword":this.category.category.toString(),

  }

//   this._channelService.getChannels(payload).subscribe();
 this._campaignService.revealdChannel(payload).subscribe(res=>{
    // this.revealdChannel = res.payload.revealedchannels
 
 })
}

getInvitelistFromServer() {
    this.transactions = [];
    let payload = {
      "page": this.invitepageIndex +1,
      "perPage":  this.pageSize,
      "camp_id":this.category.id,
      "plateform_type":this.category.plateform_type
    
  }

  this._campaignService.getCampaignInvitedList(payload).subscribe(response => {
    if (response.success) {
        this.responseList = response['payload'].influencers

        this._changeDetectorRef.markForCheck();
        this.callInitData();
    }
})
}


  @ViewChild('focus' ) tableInput
  getPaginatorData(event: PageEvent): PageEvent {
      console.log("event",event)
      this.currentPage = event.pageIndex;
      this.pageSize = event.pageSize
      this.lowValue = event.pageIndex * event.pageSize;
      this.highValue = this.lowValue + event.pageSize;
    
      // setTimeout(() => this.tableInput.scrollTo(0,0));
      // setTimeout(() => this.tableInput.nativeElement.scrollIntoView({ behavior: 'smooth', block: "top" }));
  
    //   this.getCampaignListData();
      window.scrollTo(0,0)
      window.location
      return event;
  }

  callInitData() {
    this.channels$ = this._channelService.channels$;
    this._channelService.totalChannels$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((count: number) => {
            this.totalChannels = count;
            
            this._changeDetectorRef.markForCheck();
        });
    // this.channels$ = this._channelService.channels$;

    this._channelService.suggestedtotalChannels$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((count: number) => {
            this.suggestedtotalChannels = count;
            this._changeDetectorRef.markForCheck();
        });

        // this._campaignService.invitedCampaignsCount$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((count: number) => {
        //         this.invitedCount = count;
        //         this._changeDetectorRef.markForCheck();
        //     });
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
  onTabChanged(event: any) {
    console.log("event",event);
   
      this.selectedTabIndex = event.index;
      this.selectedTabValue = event.tab.textLabel.split(" ")[0];
      console.log("event.tab.textLabel.split",event.tab.textLabel);
      
      if (event.index === 0) {
          this.status = this.userType === "BRAND" ? "" : "1";
         
        let payload = {
          "search_keyword":this.category.category.toString(),
          "plateform_type":this.category.plateform_type


      }
   
      this._channelService.getshowSimilarChannels(payload).subscribe();
      this.callInitData();
       
      } else if (event.index === 1) {
        console.log("event.index",event.index)
          // For Brand, index = 1 is LIVE.
          // For Influecer, index = 2 is INVITED
        //   this.status = this.userType === "BRAND" ? "1" : "2";
        // console.log('this.category.category',this.category.category);
        let payload = {
          "page": this.similarpageIndex +1,
          "perPage": this.pageSize,
          "plateform_type":this.category.plateform_type,
        // "search_keyword":this.category.category.toString(),

         
      }
      if(this.category.plateform_type===1){
        //   this._channelService.getChannels(payload).subscribe();
     this._campaignService.revealdChannel(payload).subscribe(res=>{
      this.revealdChannel = res.payload.revealedchannels
      // this.revealdChannel = res.payload.instachannels
      console.log("instachannels",this.revealdChannel);
      this._changeDetectorRef.markForCheck();

    this.callInitData();
      
   })
      }
      else
      {
    //   this._channelService.getChannels(payload).subscribe();
     this._campaignService.revealdChannel(payload).subscribe(res=>{
        // this.revealdChannel = res.payload.revealedchannels
        this.revealdChannel = res.payload.instachannels
        console.log("instachannels",this.revealdChannel);
        this._changeDetectorRef.markForCheck();

      this.callInitData();
        
     })
    }
    //   this.callInitData();
    //   this.loading = true
      // this._channelService.getshowSimilarChannels(payload).subscribe();

       // alert( this._channelService.getshowSimilarChannels(payload).subscribe())

        // this._channelService.getChannels(payload).subscribe();
      } else if (event.index===2){
        let payload = {
          "page": this.invitepageIndex +1,
          "perPage": this.pageSize,
          "camp_id":this.category.id,
          "plateform_type":this.category.plateform_type

        
      }
        this._campaignService.getCampaignInvitedList(payload).subscribe(response => {
            if (response.success) {
                this.responseList = response['payload'].influencers

                this._changeDetectorRef.markForCheck();
                this.callInitData();
            }
        })
        // this._campaignService.CampaignInvitation(payload).subscribe((data) => {
        //     this.responseList = data['payload'].invitations

        //     this._changeDetectorRef.markForCheck();
        //     this.callInitData();
        // });
      }
  }
  responseList:any=[]
  revealdChannel:any=[]
drafts:any=[]

trackByFn(index: number, item: any): any
{
    return item.id || index;
}
}