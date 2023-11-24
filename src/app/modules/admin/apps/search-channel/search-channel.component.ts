import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { bmiAnimations } from '@bmi/animations';
import { MatSelectChange } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

import { ChannelService } from 'app/layout/common/channel/all-channels.service';

import { MatDialog } from '@angular/material/dialog';
import { OutReachResultPopupComponent } from './out-reach-result-popup/out-reach-result-popup.component';

@Component({
    selector: 'search-channel',
    templateUrl: './search-channel.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: bmiAnimations
})
export class SearchChannelComponent implements OnInit, OnDestroy {
    subscription: SubscriptionLike;
    totalChannels: number = 0;
    channels: string[] = [];
    searchString: string;
    loading: boolean = true;
    subscriberFilter: string = "";
    averageViewFilter: string = "";
    engagementFilter: string = "";
    languageFilter: string = "";
    followers: string = "";
    influ_score: string = "";
    price: string = "";
    pagination: any;
    pageIndex: number = 0;
    pageSize = 10;
    paginator = false
    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _channelService: ChannelService,
        private _matDialog: MatDialog,

    ) {
    }

    filter: any = '1'
    ngOnInit(): void {
        this.loading = true;
        this.searchString = this._activatedRoute.firstChild?.snapshot.params['searchString'];
        if (!this.searchString || this.searchString.length < 3) {
            this._router.navigateByUrl('/dashboard');
        } else {
            let payload = {
                "perPage": this.pageSize,
                "page": '1',
                // "limit": this.pageSize,
                // "offset": 0,
                "search_keyword": this.searchString,
                "plateform_type": this.filter
            }
            this.getChannelData(payload);
        }
    }


    outReach_results(filter) {
        const inviteChannelPopup = this._matDialog.open(OutReachResultPopupComponent, {
            maxHeight: '95vh',
            maxWidth: '80vw',
            autoFocus: true,
            disableClose: true,
            data: {
                subscriber: this.subscriberFilter,
                average_view: this.averageViewFilter,
                engagement_rate: this.engagementFilter,
                language: this.languageFilter,
                search_keyword: this.searchString,
                plateform_type: this.filter,
                followers: this.followers,
                inf_score: this.influ_score,
                price: this.price,
            }
        });

        inviteChannelPopup.afterClosed().subscribe(res => {
            console.log(res);

        });
    }

    platformValue: any = 'youtube'
    scroll(el: HTMLElement) {
        el.scrollIntoView({ behavior: 'smooth' })
    }

    getChannelData(payload: any) {
        this.subscription = this._channelService.getChannels(payload)
            .subscribe((resultSets: any) => {
                this.loading = false;
                this.pagination = resultSets.payload;
                this.channels = resultSets.payload.channel_list;
                this.instaChannel = resultSets.payload.channel_list;
                this.totalChannels = this.channels.length;
                this._changeDetectorRef.markForCheck();
            });
    }

    filterByFollowers(change: MatSelectChange) {
        this.followers = change.value
        this.applyInstaFilter()
    }

    filterByInfluencerScore(change: MatSelectChange) {
        this.influ_score = change.value
        this.applyInstaFilter()
    }

    filterByPrice(change: MatSelectChange) {
        this.price = change.value
        this.applyInstaFilter()
    }
    instaChannel: any = []
    filterValue(event) {
        this.filter = event
        console.log("event", this.filter);

        if (this.filter === '1') {
            let payload = {
                "perPage": this.pageSize,
                "page": '1',
                // "limit": this.pageSize,
                // "offset": 0,
                "search_keyword": this.searchString,
                "plateform_type": this.filter
            }

            this._channelService.getChannels(payload).subscribe((resultSets: any) => {
                this.loading = false;
                this.pagination = resultSets.payload;
                this.channels = resultSets.payload.channel_list;
                console.log("channels", this.channels);


                this.totalChannels = this.channels.length;
                this._changeDetectorRef.markForCheck();
            });
        } else {
            let payload = {
                "perPage": this.pageSize,
                "page": '1',
                // "limit": this.pageSize,
                // "offset": 0,
                "search_keyword": this.searchString,
                "plateform_type": this.filter
            }
            this._channelService.getChannels(payload).subscribe((resultSets: any) => {
                this.loading = false;
                this.pagination = resultSets.payload;
                this.instaChannel = resultSets.payload.channel_list;
                // this.channels = resultSets.payload.channel_list;

                console.log("instaChannel", this.instaChannel);


                this.totalChannels = this.channels.length;
                this._changeDetectorRef.markForCheck();
            });
        }
    }


    filterBySubscribers(change: MatSelectChange): void {
        this.subscriberFilter = change.value;
        this.applyFilter();
    }

    filterByAverageViews(change: MatSelectChange): void {
        this.averageViewFilter = change.value;
        this.applyFilter();
    }

    filterByEngagementRate(change: MatSelectChange): void {
        this.engagementFilter = change.value;
        this.applyFilter();
    }

    filterByLanguage(change: MatSelectChange): void {
        this.languageFilter = change.value;
        this.applyFilter();
        this.loadmoreRecommendedChannels();
    }

    applyFilter() {
        let payload = {
            "perPage": this.pageSize,
            "page": '1',
            // "limit": this.pageSize,
            // "offset": 0,
            "subscriber": this.subscriberFilter,
            "average_view": this.averageViewFilter,
            "engagement_rate": this.engagementFilter,
            "language": this.languageFilter,
            "search_keyword": this.searchString,
            "plateform_type": this.filter,
            "accept_free_promotion":this.acceptFreePrmotion,
            "premium_influencers_only":this.premiumInfluencern,
            "must_have_promo_price":this.mustHavePromoPrice,
            "exclude_low_quality_influencers":this.exludeLowQuality
        }

        this.getChannelData(payload);
    }

    applyInstaFilter() {
        let payload = {
            "perPage": this.pageSize,
            "page": '1',
            // "limit": this.pageSize,
            // "offset": 0,
            "followers": this.followers,
            "inf_score": this.influ_score,
            "price": this.price,
            "search_keyword": this.searchString,
            "plateform_type": this.filter,
             "accept_free_promotion":this.acceptFreePrmotion,
 "premium_influencers_only":this.premiumInfluencern,
 "must_have_promo_price":this.mustHavePromoPrice,
 "exclude_low_quality_influencers":this.exludeLowQuality
        }

        this.getChannelData(payload);
    }

    acceptFreePrmotion: String="";
    premiumInfluencern: string="";
    mustHavePromoPrice: string="";
    exludeLowQuality: String="";

    acceptfreePrmotion(event) {
        console.log("event", event);
        this.acceptFreePrmotion = event.checked
        console.log("acceptfreePrmotion", this.acceptFreePrmotion);
        this.applyInstaFilter();

    }
    premiumInfluenceronly(event) {
        console.log("event", event);
this.premiumInfluencern=event.checked;
console.log("premiumInfluencern",this.premiumInfluencern);
this.applyInstaFilter();

    }
    mustHavepromoprice(event) {
        console.log("event", event);
        this.mustHavePromoPrice=event.checked
        console.log("mustHavepromoprice", event);
        this.applyInstaFilter();

    }
    exludelowQuality(event) {
        console.log("event", event);
this.exludeLowQuality=event.checked

        console.log("exludelowQuality", event);
        this.applyInstaFilter();
    }


    loadmoreRecommendedChannels() {
        let payload = {
            "perPage": this.pageSize,
            "page": '1',
            // "limit": this.pageSize,
            // "offset": 0,
            "subscriber": this.subscriberFilter,
            "average_view": this.averageViewFilter,
            "engagement_rate": this.engagementFilter,
            "language": this.languageFilter,
            "search_keyword": this.searchString
        }

        this.getChannelData(payload);
    }

    onChangePage(event) {
        this.pageIndex = event.pageIndex;
        let payload = {
            "perPage": this.pageSize,
            "page": this.pageIndex + 1,
            // "limit": this.pageSize,
            // "offset": this.pageIndex * this.pageSize,
            "search_keyword": this.searchString,
            "plateform_type": this.filter,
            "followers": this.followers,
            "inf_score": this.influ_score,
            "price": this.price,
            "subscriber": this.subscriberFilter,
            "average_view": this.averageViewFilter,
            "engagement_rate": this.engagementFilter,
            "language": this.languageFilter,
            "accept_free_promotion":this.acceptFreePrmotion,
            "premium_influencers_only":this.premiumInfluencern,
            "must_have_promo_price":this.mustHavePromoPrice,
            "exclude_low_quality_influencers":this.exludeLowQuality
        };
        this.getChannelData(payload);
        this._changeDetectorRef.markForCheck();

    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
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
