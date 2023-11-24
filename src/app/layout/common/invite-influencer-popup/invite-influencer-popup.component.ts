// import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { NotificationService } from 'app/core/services/notification.service';
// import { CampaignsService } from 'app/modules/admin/apps/campaigns/campaigns.service';


// @Component({
//     selector: 'invite-influencer-popup',
//     templateUrl: './invite-influencer-popup.component.html',
//     encapsulation: ViewEncapsulation.None,
//     changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class InviteInfluencerPopupComponent implements OnInit, OnDestroy {
//     inviteForm: FormGroup;
//     campaigns: any;
//     channelName: string = '';
//     channelId: any;
//     submitted: boolean = false;

//     constructor(
//         private _formBuilder: FormBuilder,
//         private _matDialogRef: MatDialogRef<InviteInfluencerPopupComponent>,
//         private _notifyService: NotificationService,
//         private _campaignService: CampaignsService,
//         private _router: Router,
//         @Inject(MAT_DIALOG_DATA) private _data: { channelName: string, channelId: any, campaigns: any, channel:any ,revealedChannel:any},
//     ) { }

//     ChannelID:any=[]
//     ngOnInit(): void {
//         console.log("data.campaigns",this._data.campaigns)
//         console.log("this._data.revealedChannel",this._data)
//         // if(this._data.campaigns){
//         //     this._data.campaigns.forEach(channel=> {
//         //         console.log('channel',channel.id)
//         //        this.ChannelID.push(channel.id)
//         //        console.log('ChannelID', this.ChannelID.toString())
//         //        }
                    
//         //       )
//         // }
//         if(this._data.revealedChannel){
//             this._data.revealedChannel.forEach(channel=> {
//                 console.log('channel',channel.channel_id)
//                this.ChannelID.push(channel.channel_id)
//                console.log('ChannelID', this.ChannelID.toString())
//                }
                    
//               )
//         }
       
            
//         console.log("data.channel",this._data.channel)
//         this.channelName = this._data.channelName;
//         this.campaigns = this._data.campaigns;
//         this.channelId = this._data.channelId;
//         // this.channelId = this._data.channelId;
//         let selectedCampaign = '';
//         if (this.campaigns.length === 1) {
//             selectedCampaign = this.campaigns[0].id
//         }
//         this.inviteForm = this._formBuilder.group({
//             campaign: [selectedCampaign, Validators.required]
//         });
//     }

//     proceed(): void {
//         console.log("this._data.channel.influ_id",this._data.channel.influ_id)
//         this.submitted = true;
//         if (this.inviteForm.invalid) {
//             return;
//         }
//         if(this.ChannelID){
//             let payload = {
               
//                 channel_id: this.ChannelID.toString(),
//                 camp_id: this.inviteForm.value.campaign,
//                 influ_id:this._data.channel.influ_id
//             };
            
//         console.log(payload)
//         this._campaignService.sendCampaignInvitation(payload).subscribe(data => {
//             if (data.success) {
//                 this._notifyService.showSuccess(data.message, "Success");
//                 this._matDialogRef.close(true);
//             }
//             else{
//                 this._notifyService.showError(data.message, "Error")
//             }
//         });
//         }
//         else{
//             let payload = {
//                 channel_id: this._data.channel.channel_id,
//                 camp_id: this.inviteForm.value.campaign,
//                 influ_id:this._data.channel.influ_id
               
//             };
            
//         console.log(payload)
//         this._campaignService.sendCampaignInvitation(payload).subscribe(data => {
//             if (data.success) {
//                 this._notifyService.showSuccess(data.message, "Success");
//                 this._matDialogRef.close(true);
//             }
//             else{
//                 this._notifyService.showError(data.message, "Error")
//             }
//         });
//         }
      
//     }

//     createCampaign() {
//         this._matDialogRef.close();
//         this._router.navigate(['/apps/campaigns/post']);
//     }

//     ngOnDestroy(): void {

//     }

//     trackByFn(index: number, item: any): any {
//         return item.id || index;
//     }
// }


//previuos code

import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'app/core/services/notification.service';
import { CampaignsService } from 'app/modules/admin/apps/campaigns/campaigns.service';
import { ChannelService } from '../channel/all-channels.service';


@Component({
    selector: 'invite-influencer-popup',
    templateUrl: './invite-influencer-popup.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InviteInfluencerPopupComponent implements OnInit, OnDestroy {
    inviteForm: FormGroup;
    campaigns: any;
    channelName: string = '';
    channelId: any;
    submitted: boolean = false;
    plateform_type
    list_id
    constructor(
        private _formBuilder: FormBuilder,
        private _matDialogRef: MatDialogRef<InviteInfluencerPopupComponent>,
        private _notifyService: NotificationService,
        private _campaignService: CampaignsService,
        private _channelService: ChannelService,
        private _router: Router,
        @Inject(MAT_DIALOG_DATA) private _data: { channelName: string, channelId: any, campaigns: any,plateform_type:any,list_id:any },
    ) { }

    ngOnInit(): void {
        this.channelName = this._data.channelName;
        this.campaigns = this._data.campaigns;
        this.channelId = this._data.channelId;
        this.plateform_type = this._data.plateform_type;
        this.list_id = this._data.list_id;
        console.log("channelId",this.channelId);
        console.log("campaigns",this.campaigns);
    
        let selectedCampaign = '';
        if (this.campaigns.length === 1) {
            selectedCampaign = this.campaigns[0].id
        }
        this.inviteForm = this._formBuilder.group({
            campaign: [selectedCampaign, Validators.required]
        });
    }

    proceed(): void {
        this.submitted = true;
        if (this.inviteForm.invalid) {
            return;
        }

        
        if(this._data.list_id){
            let payload = {
                channel_id: this.channelId,
                camp_id: this.inviteForm.value.campaign,
                plateform_type:this.plateform_type,
                list_id:this.list_id
            };
            this._campaignService.sendViewListInvitation(payload).subscribe(data => {
                if (data.success) {
                    this._notifyService.showSuccess(data.message, "");
                    this._matDialogRef.close(true);
                }
            });
        }else{
            let payload = {
                channel_id: this.channelId,
                camp_id: this.inviteForm.value.campaign,
                plateform_type:this.plateform_type
            };
        this._campaignService.sendCampaignInvitation(payload).subscribe(data => {
            if (data.success) {
                this._notifyService.showSuccess(data.message, "");
                this._matDialogRef.close(true);
            }
        });
    }
    }

    createCampaign() {
        this._matDialogRef.close();
        this._router.navigate(['/apps/campaigns/post']);
    }

    ngOnDestroy(): void {

    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}