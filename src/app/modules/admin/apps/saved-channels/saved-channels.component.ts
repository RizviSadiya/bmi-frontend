import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SavedChannelsService } from 'app/modules/admin/apps/saved-channels/saved-channels.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { MatDialog } from '@angular/material/dialog';
import { InviteInfluencerPopupComponent } from 'app/layout/common/invite-influencer-popup/invite-influencer-popup.component';
import { NavigationService } from 'app/core/navigation/navigation.service';

@Component({
    selector: 'saved-channels',
    templateUrl: './saved-channels.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SavedChannelsComponent implements OnInit, OnDestroy {
    channels$: Observable<any[]>;
    totalChannels: number = 0;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    campaigns: any;
    liveCamp:number=0
    pagination=true;
    /**
     * Constructor
     */
    constructor(
        private _channelService: SavedChannelsService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _campaignService: CampaignsService,
        private _matDialog: MatDialog,
        private _navigationService: NavigationService,
    ) {
    }

    ngOnInit(): void {
        this.channels$ = this._channelService.channels$;
        this._channelService.totalChannels$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.totalChannels = count;
                this._changeDetectorRef.markForCheck();
            });
            // this._navigationService.getMenucount().subscribe(res=>{
            //     if(res.success){
            //         this.liveCamp= res.payload.campaign
            //     }
            // })
    }

    filter:any='1'
    filterValue(event){
this.filter=event

this.getOrderlistFromServer()  
    }

    onChangePage(event) {
        console.log("event",event);
        
        this.pageIndex = event.pageIndex;
        this.getOrderlistFromServer();
        this.currentPage = event.pageIndex;
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
    pageIndex: number = 0;
    currentPage = 0;
    pageSize = 10;
    getOrderlistFromServer() {
        this.transactions = [];
        let payload = {
            // "limit": this.pageSize,
            "page": this.pageIndex + 1,
            "perPage":  this.pageSize,
            "plateform_type":this.filter

        }
        this._channelService.getChannels(payload).subscribe(responce=>{
            if (responce['success']) {
                this.channels = responce['payload'].savedchannels
                ;
                console.log("channels",this.channels);
                
            }

        })   
        window.scrollTo(0,0)

    }

   


    inviteAll() {
        let payload = {
            "status": "1",
            "page": "1",
            "perPage": "10"
        };
        this._campaignService.getCampaigns(payload).subscribe(data => {
            this.campaigns = data['payload'].campaign;
            this.openInvitationPopup("All");

        });
       

    }
    openInvitationPopup(channel) {
        const inviteChannelPopup = this._matDialog.open(InviteInfluencerPopupComponent, {
            maxHeight: '95vh',
            maxWidth: '80vw',
            autoFocus: true,
            disableClose: true,
            data: {
                channelName: 'All',
                channelId: 'All',
                campaigns: this.campaigns
            }
        });

        inviteChannelPopup.afterClosed().subscribe(res => {
            console.log(res);

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

    scroll(el: HTMLElement) {
        el.scrollIntoView({behavior: 'smooth'});
    }
}
