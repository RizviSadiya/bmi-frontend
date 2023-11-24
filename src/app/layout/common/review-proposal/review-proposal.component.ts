import { ChangeDetectionStrategy, Component, Input,Inject ,OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Channel } from '../channel/all-channels.types';
import { CampaignsService } from 'app/modules/admin/apps/campaigns/campaigns.service';
import { LandingPageService } from 'app/modules/landing/landing-page.service';
@Component({
    selector: 'app-review-proposal',
    templateUrl: './review-proposal.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewProposalComponent implements OnInit, OnDestroy {
    @Input() proposalForm: FormGroup;
    @Input() selectedChannel: string;
    @Input() selectedChannelName:any;
    @Input() applychannel: string;
    @Input() userName: any;
    @Input() campaignPrice;
    @Input() plateform_type;
proposalView:any
    constructor(
        private _router:Router,
        private _campaignsService:CampaignsService,
        private _LandingPageService:LandingPageService,
        // @Inject(MAT_DIALOG_DATA) private _data: { data:Response },
    ) { }

    ngOnInit(): void {
        console.log("selectedChannel",this.selectedChannel)
        console.log("proposalForm",this.proposalForm.value)
        console.log("plateform_type",this.plateform_type)
        console.log("username",this.userName)
this._LandingPageService.getChannelList('').subscribe(channels=>{
    let channel=channels.payload.channel_list.filter(res=>res)
console.log("channel",channel);
console.log("this.proposalForm.controls.channel_id.value",this.proposalForm.get('step1').get('channel_id').value);
let channelID=this.proposalForm.get('step1').get('channel_id').value
console.log("channelID",channelID);

})
        // this.proposalView=this._data
            this.nextStateRoute = this._campaignsService.getNextRouteSelectedBeforeSave();
            
                this._router.navigate([this.nextStateRoute]);
                console.log("nextStateRoute",this.nextStateRoute);
        this.navigateToNextStep()
       
    }

    nextStateRoute: string = null;
    navigateToNextStep() {
        let nextState = this.nextStateRoute ? this.nextStateRoute : '/apps/campaigns/all';
        this._router.navigate([nextState]);
    }

    ngOnDestroy(): void {

    }
}