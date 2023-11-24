import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject ,OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';

import { RevealedChannelsService } from 'app/modules/admin/apps/revealed-channels/revealed-channels.service';
import { InviteInfluencerPopupComponent } from 'app/layout/common/invite-influencer-popup/invite-influencer-popup.component';
import { MatDialog,MatDialogRef ,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CampaignsService } from '../campaigns/campaigns.service';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { UserService } from 'app/core/user/user.service';
import { WalletHistoryService } from '../wallet/history/history.service';
import { NotificationService } from 'app/core/services/notification.service';
@Component({
    selector: 'revealed-channels',
    templateUrl: './revealed-channels.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RevealedChannelsComponent implements OnInit, OnDestroy {
    channels$: Observable<any[]>;
    totalChannels: number = 0;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    pageSize = 10;
    pagination=false
    currentPage = 0;
    lowValue: number = 0;
    campaigns: any;
    highValue: number = 10;
    liveCamp:number=0
    inviteForCamp:any
    // pagination: any;
    /**
     * Constructor
     */
    constructor(
        private _channelService: RevealedChannelsService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialog: MatDialog,
        // private _matDialogRef: MatDialogRef<RevealedChannelsComponent>,
        private _campaignService: CampaignsService,
        private _navigationService: NavigationService,
        private userService:UserService,
        private _walletService: WalletHistoryService,
        private _notifyService: NotificationService,

     
    ) {
    }
    
    orders$: Observable<[]>;

    
    ngOnInit(): void {
        this.callInitData();
    this.channels = this.userService.getListData()
    console.log("this.channels",this.channels);

       this.inviteForCamp= this.userService.getinviteList();
      
       console.log("this.inviteForCamp",this.inviteForCamp);
       
        this.getRevealedDetailsFromServer()
        // this._navigationService.getMenucount().subscribe(res=>{
        //     if(res.success){
        //         this.liveCamp= res.payload.campaign
        //     }
        // })
    }

    getPaginatorData(event: PageEvent): PageEvent {
        this.currentPage = event.pageIndex;
        this.lowValue = event.pageIndex * event.pageSize;
        this.highValue = this.lowValue + event.pageSize;
        this.getFreshData();
        return event;
    }

    onChangePage(event) {
        console.log("event",event);
        this.pageSize=event.pageSize
        this.pageIndex = event.pageIndex;
        this.getRevealedDetailsFromServer();
    }

    getFreshData() {
        let payload = {
            // "limit": this.pageSize,
            // "offset": this.currentPage * this.pageSize
            "page": this.pageIndex + 1,
            "perPage": this.pageIndex * this.pageSize,
            // "plateform_type":

        }
        
        this._channelService.getChannels(payload).subscribe();
        this.callInitData();

    }

    transactions: any;
    channels;
    pageIndex: number = 0;
 
    getRevealedDetailsFromServer() {
        this.transactions = [];
        let payload = {
            // "limit": this.pageSize,
            "page": this.pageIndex + 1,
            "perPage": this.pageSize,
            "plateform_type":this.filter

        }
        this._channelService.getChannels(payload).subscribe(responce=>{
            if (responce['success']) {
                this.channels = responce['payload'].revealedchannels;
                this.instaChannel = responce['payload'].instachannels;
                // this.revealedChannel = responce['payload'].revealedchannels;
                console.log("channels",this.channels);
                
            }
        })
    
        // this._walletService.getWallets(1, this.pageIndex + 1, this.pageSize).subscribe(data => {
        //     console.log(data)
        //     if (data['success']) {
        //         this.transactions = data['payload'].data;
        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     }
        // });
        
    }

    

    callInitData() {
        this.channels$ = this._channelService.channels$;
        this._channelService.totalChannels$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.totalChannels = count;
                // this.pagination = count;
                this._changeDetectorRef.markForCheck();
            });

            this._walletService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: any) => {
                // Update the pagination
                this.pagination = pagination;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

   

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
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



revealedChannel:any
    inviteAll() {
        let payload = {
            "status": "1",
            "perPage": "10",
            "page": "1"
            // "limit": "",
            // "offset": ""
        };
        this._campaignService.getCampaigns(payload).subscribe(data => {
            this.campaigns = data['payload'].campaign;
            this.openInvitationPopup('All');

        });
    }

    filter='1'
    instaChannel:any
    filterValue(event){
        this.filter=event
        console.log("event",this.filter);
        // this.getRevealedDetailsFromServer()
        if(this.filter==='1'){

            let payload = {
                // "limit": this.pageSize,
                "page": this.pageIndex + 1,
                "perPage": this.pageSize,
                "plateform_type":this.filter
    
            }
            this._channelService.getChannels(payload).subscribe(responce=>{
                if (responce['success']) {
                    this.channels = responce['payload'].revealedchannels;
                    // this.revealedChannel = responce['payload'].revealedchannels;
                    console.log("channels",this.channels);
                    
                }
            })
        }else{
            
            let payload = {
                // "limit": this.pageSize,
                "page": this.pageIndex + 1,
                "perPage": this.pageSize,
                "plateform_type":this.filter
    
            }
            this._channelService.getChannels(payload).subscribe(responce=>{
                if (responce['success']) {
                    this.instaChannel = responce['payload'].instachannels;
                    // this.revealedChannel = responce['payload'].revealedchannels;
                    console.log("channels",this.channels);
                    
                }
            })
        }
      
    }

    suggestedList:any
    suggestedChannel(){

        let payload={
          
            "subscriber":this.inviteForCamp.subscriber,
            "average_view":this.inviteForCamp.average_view,
            "engagement_rate":this.inviteForCamp.engagement_rate,
            "language":this.inviteForCamp.lang,
            "search_keyword":this.inviteForCamp.category.toString()
        }
        this._campaignService.getSuggestedChannelList(payload).subscribe(res=>{
            if(res.success){
              
                this.suggestedList= res.payload.channel_list
                console.log("suggestedChannel",this.suggestedList);
                
            }
        })
    
    }


    openInvitationPopup(channel) {
        if (this.campaigns && this.campaigns.length > 0) {
        const inviteChannelPopup = this._matDialog.open(InviteInfluencerPopupComponent, {
            maxHeight: '95vh',
            maxWidth: '80vw',
            autoFocus: true,
            disableClose: true,
            data: {
                channelName: 'All',
                channelId: 'All',
                campaigns: this.campaigns,
                channel:  channel,
                revealedChannel:  this.revealedChannel,
            }
        });

        inviteChannelPopup.afterClosed().subscribe(res => {
            console.log(res);

        });
    } else {
        this._notifyService.showInfo("You don't have any active campaign to send invite ", "");
    }

    }

    scroll(el: HTMLElement) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
}
