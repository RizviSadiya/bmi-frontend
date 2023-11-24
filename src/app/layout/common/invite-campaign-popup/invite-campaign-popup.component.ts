import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'app/core/services/notification.service';
import { CampaignsService } from 'app/modules/admin/apps/campaigns/campaigns.service';
import { NavigationService } from 'app/core/navigation/navigation.service';

@Component({
    selector: 'invite-campaign-popup',
    templateUrl: './invite-campaign-popup.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InviteCampaignPopupComponent implements OnInit, OnDestroy {
    inviteForm: FormGroup;
    campaign: any;
    influencerList = [];
    channelList = [];
    submitted: boolean = false;
    searchTxt = '';

    constructor(
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialogRef: MatDialogRef<InviteCampaignPopupComponent>,
        private _notifyService: NotificationService,
        private _campaignService: CampaignsService,
        private _navigationService: NavigationService,
        @Inject(MAT_DIALOG_DATA) private _data: { campaign: any, influencers: any },
    ) { }

    revealedChannels:any
    ngOnInit(): void {
        this._navigationService.getMenucount().subscribe(item=>{
            
            if(item.payload.plan_id == 3 || item.payload.plan_id == 2){
                // console.log("count",item.payload,item);
                this.revealedChannels=item.payload.revealedChannels
                console.log("revealedChannelscount",this.revealedChannels);
                
              }
               
        })
        this.campaign = this._data.campaign;
        this.influencerList = this._data.influencers;
        let selectedInfluencer = '';
        if (this.channelList.length === 1) {
            selectedInfluencer = this.channelList[0].id
        }
        this.inviteForm = this._formBuilder.group({
            influencer: [selectedInfluencer, Validators.required],
            searchTxt: ['']
        });
       
        // this.influencerList = ["nitesh@gmail.com", "influencer@gmail.com"];
        this._campaignService.getInvitedInfluencers({ camp_id: this.campaign.id }).subscribe(data => {
            if (Object.entries(data['payload']).length !== 0) {
                this.channelList = data['payload'].filter(channel => channel.title !== "");
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    searchTextChanged() {
        console.log(this.inviteForm.value.searchTxt);
        this.searchTxt = this.inviteForm.value.searchTxt;
    }

    proceed(): void {
        this.submitted = true;
        if (this.inviteForm.invalid) {
            return;
        }

        let payload = {
            camp_id: this.campaign.id,
            channel_id: this.inviteForm.value.influencer.toString()
        };
        this._campaignService.sendCampaignInvitation(payload).subscribe(data => {
            if (data.success) {
                this._notifyService.showSuccess(data.message, "");
                this._matDialogRef.close(true);
            }
        });
    }

    ngOnDestroy(): void {

    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}