import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash-es';

import { NotificationService } from 'app/core/services/notification.service';
import { CampaignsService } from '../campaigns.service';
import { HireConfirmationPopupComponent } from 'app/layout/common/hire-confirmation-popup/hire-confirmation-popup.component';

@Component({
    selector: 'campaign-responses',
    templateUrl: './responses.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampaignResponsesComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    selectedCampaignId;
    campaign = {};
    responsesCount: number = 0;
    pendingCount: number = 0;
    invitedCount: number = 0;
    shortlistedCount: number = 0;
    messagesCount: number = 0;
    selectedTabIndex: number = 0;
    responseList = [];
    instaresponseList = [];
    drawerMode: 'side' | 'over';

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _campaignService: CampaignsService,
        private _notifyService: NotificationService,
        private _matDialog: MatDialog,
        
    ) { }
gst_per:any
plateform_type:any
    ngOnInit(): void {
        this.selectedCampaignId = this._activatedRoute.firstChild?.snapshot.params['id'];
this.gst_per= JSON.parse(sessionStorage.getItem("website")) 
console.log("gst_per",this.gst_per);

        this._campaignService.campaignResponse$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
                this.campaign = data['campaign'];
                this.campaign['isReadMore'] = true;
                this.responseList = data['applications'];
                this.instaresponseList = data['channel_list'];
                console.log(this.responseList,'response List');
                console.log(this.instaresponseList,'instaresponseList List');
        this.plateform_type = this._campaignService.getPlateForm()
        console.log(this.plateform_type,'plateform_type List');
                
                this._changeDetectorRef.markForCheck();
            });

        this._campaignService.totalResponses$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.responsesCount = count;
                this._changeDetectorRef.markForCheck();
            });

        this._campaignService.totalPendings$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.pendingCount = count;
                this._changeDetectorRef.markForCheck();
            });

        this._campaignService.shortlistedResponses$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.shortlistedCount = count;
                this._changeDetectorRef.markForCheck();
            });

        this._campaignService.totalMessages$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.messagesCount = count;
                this._changeDetectorRef.markForCheck();
            });

            this._campaignService.invitedCampaignsCount$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.invitedCount = count;
                this._changeDetectorRef.markForCheck();
            });
    }
    status
    onTabChanged(event: any) {
        console.log("event",event);
        // let plateform_type = this._campaignService.getPlateForm()'
        this._campaignService.setPlateForm(this.plateform_type)
        window.sessionStorage.setItem('plateform_type', JSON.stringify(this.plateform_type) )
        this.responseList = [];
        this.instaresponseList = [];
        this.selectedTabIndex = event.index;
       this.status = event.index === 0 ? '' : event.index === 1 ? '0' : event.index === 2 ? '2':event.index === 3 ? '2':'';
          let paylod:any={
            "camp_id":this.selectedCampaignId,
            "status":this.status,
            "plateform_type":this.plateform_type?.plateform_type
        }
        this._campaignService.getCampaignResponseById(this.selectedCampaignId,this.status,this.plateform_type?.plateform_type).subscribe((data) => {
            this._changeDetectorRef.markForCheck();
        });
        if(event.index===3){
            this._campaignService.CampaignInvitation(this.selectedCampaignId).subscribe((data) => {
                this.responseList = data['payload'].invitations
                this._changeDetectorRef.markForCheck();
            });
        }
    }

    onHireClick(response: any) {
        console.log("Hire is clicked");
        let hireData = {
            campaign_budget: response.price,
            currency: response.currency,
            gst: this.gst_per.tax_per,
            application_id: response.application_id
        }
        const hireConfirmationPopupDialog = this._matDialog.open(HireConfirmationPopupComponent, {
            autoFocus: false,
            maxHeight: '99vh',
            data: {
                response: cloneDeep(hireData)
            }
        });

        hireConfirmationPopupDialog.afterClosed().subscribe((result) => {
            if (result) {
                // const indx = this.responseList.findIndex(v => v.application_id === response.application_id);
                // this.responseList.splice(indx, indx >= 0 ? 1 : 0);
                // // const indx2 = this.instaresponseList.findIndex(v => v.application_id === response.application_id);
                // // this.responseList.splice(indx2, indx2 >= 0 ? 1 : 0);
                // if (this.selectedTabIndex === 0) {
                //     this.responsesCount -= 1;
                // } else if (this.selectedTabIndex === 1) {
                //     this.shortlistedCount -= 1;
                // }
                // this._changeDetectorRef.markForCheck();
            }
        });
    }

    onShortlistClick(response: any) {
        this._campaignService.setPlateForm(response)
        this._campaignService.shotlistChannel(response.application_id).subscribe(
            data => {
                this._notifyService.showSuccess(data.message, "");
                if(response.plateform_type===1 || this.responseList){
                const indx = this.responseList.findIndex(v => v.application_id === response.application_id);
                this.responseList.splice(indx, indx >= 0 ? 1 : 0);
                // this.responsesCount -= 1;
                this.pendingCount -= 1;
                this.shortlistedCount += 1;
this._campaignService.setPlateForm(data.payload)

                // window.location.reload()
                this._campaignService.getCampaignResponseById(this.selectedCampaignId,this.status,this.plateform_type?.plateform_type).subscribe((data) => {
                    this._changeDetectorRef.markForCheck();
this._campaignService.setPlateForm(data.payload)

                });
        this._changeDetectorRef.markForCheck();
                }
                else if(response.plateform_type===2 || this.instaresponseList){
                const indx2 = this.instaresponseList?.findIndex(v => v.application_id === response.application_id);
                this.instaresponseList?.splice(indx2, indx2 >= 0 ? 1 : 0);
                // this.responsesCount -= 1;
                this.pendingCount -= 1;
                this.shortlistedCount += 1;
this._campaignService.setPlateForm(data.payload)

                this._campaignService.getCampaignResponseById(this.selectedCampaignId,this.status,this.plateform_type?.plateform_type).subscribe((data) => {
                    this._changeDetectorRef.markForCheck();
this._campaignService.setPlateForm(data.payload)

                });
                // window.location.reload()
        this._changeDetectorRef.markForCheck();
                }
            }
        );
        this._changeDetectorRef.markForCheck();

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

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}