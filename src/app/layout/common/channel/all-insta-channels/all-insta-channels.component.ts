import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild, ViewEncapsulation, OnDestroy, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CampaignsService } from 'app/modules/admin/apps/campaigns/campaigns.service';
import { Subject } from 'rxjs';

import { ChannelService } from '../all-channels.service';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'all-insta-channels',
  templateUrl: './all-insta-channels.component.html',
  styleUrls: ['./all-insta-channels.component.scss']
})
export class AllInstaChannelsComponent implements OnInit {
  channels: any;
    pageSize = 10;
    currentPage = 0;
    totalCampaignsCount: number = 0;
    lowValue: number = 0;
    highValue: number = 5;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @Input() limit: number;
    @Input() offset: number;
    @Input() channel: any;
    @Input() searchString: any;
    @Output() readonly totalChannels: EventEmitter<number> = new EventEmitter<number>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _channelService: ChannelService,
        private _campaignService: CampaignsService,
    ) {
    }

    total:any
    pagination=true;
    ngOnInit(): void {
        console.log("searchString",this.searchString);
        console.log("inschannel",this.channel);
        
        let payload = {
            // "limit": this.limit,
            // "offset": this.offset
            "page":'1',
            "perPage":10,
            "plateform_type":2
        };
        // Get the data
        this._channelService.getChannels(payload).subscribe((data) => {
            this.channels = data['payload'].channel_list;
            console.log("plateform_type:2",this.channels);
            
            this.total = data['payload'].totalCount;
            // this.data = data;
            // Execute the observable
            this.totalChannels.next(this.channels.length);
            this._changeDetectorRef.markForCheck();
        });
    }

    
    onChangePage(event) {
        console.log("event",event);
        
        this.pageIndex = event.pageIndex;
        this.currentPage = event.pageIndex;
        this.pageSize = event.pageSize
        this.getChannelslistFromServer();
        this._changeDetectorRef.markForCheck();

    }

    scroll(el:HTMLElement) {
        el.scrollIntoView({ behavior: 'smooth'});
      }

    transactions: any;
    // channels;
    pageIndex: number = 0;
    // currentPage = 0;
    // pageSize = 10;
    getChannelslistFromServer() {
        this.transactions = [];
        let payload = {
            // "limit": this.pageSize,
            "page": this.pageIndex + 1,
            "perPage":  this.pageSize,
            "plateform_type":'2'
        }
        this._channelService.getChannels(payload).subscribe(responce=>{
            if (responce['success']) {
                this.channels = responce['payload'].channel_list;
            this._changeDetectorRef.markForCheck();

                console.log("channels",this.channels);
                
            }

        })   
        window.scrollTo(0,0)

    }

    
    @ViewChild('focus', { read: ElementRef }) tableInput: ElementRef;
    getPaginatorData(event: PageEvent): PageEvent {
        console.log("event",event)
        this.currentPage = event.pageIndex;
        this.pageSize = event.pageSize
        this.lowValue = event.pageIndex * event.pageSize;
        this.highValue = this.lowValue + event.pageSize;
      
        
        setTimeout(() => this.tableInput.nativeElement.scrollIntoView({ behavior: 'smooth', block: "top" }));
    
        this.getCampaignListData();
        window.scrollTo(0,0)
        window.location
        return event;
    }
    status: string = "1";
    getCampaignListData() {

        let payload = {
            // "limit": this.pageSize,
            // "offset": this.currentPage * this.pageSize,
            "perPage": this.pageSize,
            "page": this.currentPage +1,
            "status": this.status,

        }
    
        // Get the data
        this._channelService.getChannels(payload).subscribe((data) => {
            this.channels = data['payload'].channel_list;
            // this.data = data;
            // Execute the observable
            this.totalChannels.next(this.channels.length);
            this._changeDetectorRef.markForCheck();
        });
    }


    channelDeleted(event) {
        const indx = this.channels.findIndex(v => v.id === event);
        this.channels.splice(indx, indx >= 0 ? 1 : 0);
        this.totalChannels.next(this.channels.length);
    }

    defaultChannelChanged(event) {
        this.channels.forEach(element => {
            element.is_default = 0;
            if (element.id === event) {
                element.is_default = 1;
            }
        });
        this._changeDetectorRef.markForCheck();
    }

    /**
    * On destroy
    */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
