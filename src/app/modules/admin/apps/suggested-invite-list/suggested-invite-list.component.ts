import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash-es';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { BmiConfirmationService } from '@bmi/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { Channel } from 'app/layout/common/channel/all-channels.types';
import { ChannelPricePopupComponent } from 'app/layout/common/channel-price-popup/channel-price-popup.component';
import { InfluencerChannelService } from 'app/layout/common/influencer-channel/influencer-channel.service';
import { NotificationService } from 'app/core/services/notification.service';
import { DashboardService } from 'app/modules/admin/dashboard/dashboard.service';
import { VerifyChannelPopupComponent } from 'app/layout/common/verify-channel-popup/verify-channel-popup.component';
import { InviteInfluencerPopupComponent } from 'app/layout/common/invite-influencer-popup/invite-influencer-popup.component'; 
import { ListSelectionPopupComponent } from 'app/layout/common/list-selection-popup/list-selection-popup.component'; 
import { CampaignsService } from 'app/modules/admin/apps/campaigns/campaigns.service';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { QuickChatService } from 'app/layout/common/quick-chat/quick-chat.service';
import { CreditTopupComponent } from 'app/layout/common/credit-topup/credit-topup.component';
import { ReviewProposalComponent } from 'app/layout/common/review-proposal/review-proposal.component'; 
import { ViewProposalComponent } from 'app/layout/common/influencer-channel/view-proposal/view-proposal.component'; 
import { Observable} from 'rxjs';
import { RevealChannelpopupComponent } from '../campaigns/reveal-channelpopup/reveal-channelpopup.component';

@Component({
  selector: 'app-suggested-invite-list',
  templateUrl: './suggested-invite-list.component.html',
  styleUrls: ['./suggested-invite-list.component.scss']
})
export class SuggestedInviteListComponent implements OnInit {
//  @Input() similarInfluencer:any
channels$: Observable<any[]>;
private _unsubscribeAll: Subject<any> = new Subject<any>();
 similarInfluencer:any
 similarCat:any
 userType:any
 userData:any
 userDetails:any
 totalChannels: number = 0;
 revealChannelForm: FormGroup;
 publicForm: FormGroup;
 addCreditOrUpgradeForm: FormGroup;
 whatsappRequestForm: FormGroup;
 liveCamp: number = 0;
 currentPage: number = 0;
 pageSize =10;
 @Output() channelRevealed: EventEmitter<boolean> = new EventEmitter<boolean>();
  campaigns: any;

  constructor( 
    private _campainsService :CampaignsService, private _userService:UserService,
    private _navigationService: NavigationService,
    private _bmiConfirmationService: BmiConfirmationService,
    private _channelService: InfluencerChannelService,
    private _formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _notifyService: NotificationService,
    private _router:Router,
    private _matDialog: MatDialog,
    private _campaignService: CampaignsService,
      ) { }
dontShowMe:any
PlateForm:any
  ngOnInit(): void {    
            this.similarInfluencer= this._campainsService.getSimilardata()
            this.similarCat= this._campainsService.getSimilarcatdata()
            this. totalChannels=this.similarInfluencer?.totalCount
    this.PlateForm= this._campaignService.getPlateForm()
        console.log("suggestedchannelpage", this.similarInfluencer)
        console.log("PlateForm", this.PlateForm)
        console.log("similarCat", this.similarCat)
    this.dontShowMe= JSON.parse(localStorage.getItem('userInfo'))
        this.userType = this._userService.userDetails.userType.toUpperCase();  
        this.userDetails = this._userService.userDetails  
        // this._navigationService.getMenucount().subscribe(res=>{
        //     if(res.success){
        //         this.liveCamp= res.payload.campaign
        //     }
        // })
        this._userService.user$.subscribe(data => {
          this.userData = data
        
      });
        
  }
  pageIndex:any
  pagination=false
  onChangeInvitePage(event){
    console.log("event",event);
    
    this.pageIndex = event.pageIndex;
    this.getInvitelistFromServer();
    // this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize
  }

  getInvitelistFromServer() {
  
    let payload = {
      "page": this.pageIndex +1,
      "perPage":  this.pageSize,
      "search_keyword":this.similarCat.toString(),
      // "limit": this.pageSize,
      // "offset": this.currentPage * this.pageSize
  }

 

this._campaignService.showSimilar(payload).subscribe(res=>{
if(res.success){
    this.similarInfluencer=res.payload
    console.log("similarInfluencer",this.similarInfluencer);
    
  
}
})
}

  whatsappRequest(channel){
    this.whatsappRequestForm = this._formBuilder.group({
        title: 'WhatsApp Request',
        message: 'Are you sure you want to send WhatsApp Request?',
        icon: this._formBuilder.group({
            show: false,
            name: 'heroicons_outline:exclamation',
            color: 'warn'
        }),
        actions: this._formBuilder.group({
            confirm: this._formBuilder.group({
                show: true,
                label: 'Yes',
                color: 'warn'
            }),
            cancel: this._formBuilder.group({
                show: true,
                label: 'Cancel'
            })
        }),
        dismissible: true
    });

    // Open the dialog and save the reference of it
    const dialogRef = this._bmiConfirmationService.open(this.whatsappRequestForm.value);

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
        if (result === "confirmed") {
        
            let obj={
                "channel_id":channel.channel_id
            }
          this._campaignService.sendWhatsappRequest(obj).subscribe(res=>{
            if(res.success){
                this._notifyService.showSuccess(res.message,"")
            }
            else{
                this._notifyService.showError(res.message ,"")
            }
          })
        }
    });
  
}

un_revealchannel(id, credit_cost,channel,el:HTMLElement){
    if(channel.is_revealed !=true){
        this.publicForm = this._formBuilder.group({
            title: 'Reveal Request',
            message: 'This feature is available for Revealed channel, to enable this feature you must reveal this channel.',
            // message: 'Only paid users can use this feature.',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:exclamation',
                color: 'warn'
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Reveal Channel',
                    color: 'success'
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Cancel'
                })
            }),
            dismissible: true
        });

        // Open the dialog and save the reference of it
        const dialogRef = this._bmiConfirmationService.open(this.publicForm.value);

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result === "confirmed") {
            
                // this._campaignService.DeleteProposal(this.application.id).subscribe(res=>{
                //     if(res.code==200){
                //        this.toaster.success(res.message)
                //         this.getList.emit()
                //         window.location.reload()
                //     console.log("this.getList",this.getList.emit())
                //     }
                //     else{
                //       this.toaster.error(res.message)
                //     }
                // })
                // this._router.navigate(['/choose-plan'])
                this.revealChannel(id, credit_cost,channel,channel)
            }
        });
       
    }
    // if(this.userPlan===1){
    //     this._notifyService.showError("we should prompt user to upgrade as this feature is only for paid plans.","Error")
    //     this.campaignForm.get('step2').get('visibility').setValue(this.userPlan)
    // }
    // console.log("planId",this.campaignForm.get('step2').get('visibility').value,)
}

revealChannelPopup(id, credit_cost,channel): void {
    const dialogRef = this._matDialog.open(RevealChannelpopupComponent, {
      width: '350px',
      data:channel
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('result',result);
      console.log('The dialog was closed');
      
      if(id==result.id){
        console.log("result",result);

          this.similarInfluencer.channel_list.is_revealed=true
            this.similarInfluencer=result
            this.channelRevealed.next(true);
            this._navigationService.updateLeftMenuItem(true);
            this._changeDetectorRef.markForCheck();
        }
    
    });
  }

  revealedChannel:any
    inviteAll() {
        let payload = {
            "status": "1",
            "page": "1",
            "perPage": "10"
        };
        this._campaignService.getCampaigns(payload).subscribe(data => {
            this.campaigns = data['payload'].campaign;
            this.openInvitationAllPopup('All');

        });
       
        console.log("this.channels$",this.channels$.subscribe(res=>{
        this.revealedChannel= res
    
}));

    }

  inviteChannel(channel) {
    if (!this.campaigns) {
        let payload = {
            "status": "1",
            "page": "1",
            "perPage": "10"
        };
        this._campaignService.getCampaigns(payload).subscribe(data => {
            this.campaigns = data['payload'].campaign;
            this._changeDetectorRef.markForCheck();
            this.openInvitationPopup(channel);
        });
    } else {
        this.openInvitationPopup(channel);
    }
}

openInvitationPopup(channel) {
  console.log("channel",channel);
  
  if (this.campaigns && this.campaigns.length > 0) {
      const inviteChannelPopup = this._matDialog.open(InviteInfluencerPopupComponent, {
          maxHeight: '95vh',
          maxWidth: '80vw',
          autoFocus: true,
          disableClose: true,
          data: {
              channelName: channel.title,
              channelId: channel.id,
              campaigns: this.campaigns,
              channel:channel
          }
      });

      inviteChannelPopup.afterClosed().subscribe(response => {
          if (response) {
              // Invite Channel popup closed, update the UI
              if (channel.id === channel.id) {
                  channel.is_invite = true;
              }
              this._changeDetectorRef.markForCheck();
          }
      });
  } else {
      this._notifyService.showInfo("You donot have any Live campaign to send invite", "");
  }
}
openInvitationAllPopup(channel) {
  console.log("channel",channel);
  
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
              channel:channel
          }
      });

      inviteChannelPopup.afterClosed().subscribe(response => {
          if (response) {
              // Invite Channel popup closed, update the UI
              if (channel.id === channel.id) {
                  channel.is_invite = true;
              }
              this._changeDetectorRef.markForCheck();
          }
      });
  } else {
      this._notifyService.showInfo("You donot have any Live campaign to send invite", "");
  }
}

revealChannel(id, credit_cost,channel,el:HTMLElement) {
    console.log("channel",channel);
    
    if (this.userData.plan_id === 1 && channel.EstViews > 50000) {

        this.publicForm = this._formBuilder.group({
            title: 'Upgrade Plan',
            message: ' 50K+ Channel Reveal, is not for Free plan , it is only for Starter or bussiness plan.',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:exclamation',
                color: 'warn'
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Upgrade Plan',
                    color: 'success'
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Cancel'
                })
            }),
            dismissible: true
        });

        // Open the dialog and save the reference of it
        const dialogRef = this._bmiConfirmationService.open(this.publicForm.value);

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result === "confirmed") {
            
                // this._campaignService.DeleteProposal(this.application.id).subscribe(res=>{
                //     if(res.code==200){
                //        this.toaster.success(res.message)
                //         this.getList.emit()
                //         window.location.reload()
                //     console.log("this.getList",this.getList.emit())
                //     }
                //     else{
                //       this.toaster.error(res.message)
                //     }
                // })
                this._channelService.setPlantype("upgradePlan")
                this._router.navigate(['/choose-plan'])
            }
        });
       
    } 
    else if (this.userData.plan_id === 2 && channel.EstViews > 50000) {

        this.publicForm = this._formBuilder.group({
            title: 'Upgrade Plan',
            message: ' 50K+ Channel Reveal, is not for Starter plan , it is only for bussiness plan.',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:exclamation',
                color: 'warn'
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Upgrade Plan',
                    color: 'success'
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Cancel'
                })
            }),
            dismissible: true
        });

        // Open the dialog and save the reference of it
        const dialogRef = this._bmiConfirmationService.open(this.publicForm.value);

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result === "confirmed") {
            
                // this._campaignService.DeleteProposal(this.application.id).subscribe(res=>{
                //     if(res.code==200){
                //        this.toaster.success(res.message)
                //         this.getList.emit()
                //         window.location.reload()
                //     console.log("this.getList",this.getList.emit())
                //     }
                //     else{
                //       this.toaster.error(res.message)
                //     }
                // })
                this._channelService.setPlantype("upgradePlan")
                this._router.navigate(['/choose-plan'])
            }
        });
       
    } 
    else {
    //     this.revealChannelForm = this._formBuilder.group({
    //         title: 'Reveal Channel',
    //         message: 'Are you sure you want to reveal this channel using <strong>' + credit_cost + ' credits</strong>?',
    //         icon: this._formBuilder.group({
    //             show: true,
    //             name: 'heroicons_outline:badge-check',
    //             color: 'primary'
    //         }),
    //         actions: this._formBuilder.group({
    //             confirm: this._formBuilder.group({
    //                 show: true,
    //                 label: 'Yes, Proceed',
    //                 color: 'primary'
    //             }),
    //             cancel: this._formBuilder.group({
    //                 show: true,
    //                 label: 'No, Cancel'
    //             })
    //         }),
    //         dismissible: true
    //     });

    // // }
    // // Open the dialog and save the reference of it
    // const dialogRef = this._bmiConfirmationService.open(this.revealChannelForm.value);

    // Subscribe to afterClosed from the dialog reference
    // dialogRef.afterClosed().subscribe((result) => {
    //     if (result === "confirmed") {
            let payload = {
                "channel_id": channel.id,
                "plateform_type":channel.plateform_type

            };
            // console.log("payload",payload);
            
            // this._channelService.revealChannel(payload).subscribe(
            //     data => {
            //         if(data.success===true){
            //             // this._notifyService.showSuccess(data.message, "success");
            //             if (this.channel.id === id) {
            //                 console.log("this.channel.id",this.channel.id);
            //                 console.log("id",id);
                            
            //                 this.channel.is_revealed = true;
                        
            //                 this.channel = data.payload.channel;
                            
            //                  el.scrollIntoView({ behavior: 'smooth' });

            //                 // if(this.response !=''){
            //                 //     window.location.reload()
            //                 // }
            //                 console.log("data.payload.channel",data.payload.channel);
            //                 console.log("this.channel",this.channel);
                            
            //             }
            //             // window.location.reload()
            //         }
                  
            //         this.channelRevealed.next(true);
            //         this._navigationService.updateLeftMenuItem(true);
            //         // this._changeDetectorRef.markForCheck();
            //     },
            //     error => {
            //         if (error === "Credit blance is low") {
            //             this.askForTopupOrUpgrade();
            //         }
            //         // this._notifyService.showSuccess(error.message, "error");

            //     });
            // this._channelService.revealChannel(payload).subscribe(
            //     data => {
            //         this._notifyService.showSuccess(data.message, '');
            //         console.log("data beforeif",data);
                    
            //         if (channel.id === id) {
            //            channel.is_revealed = true;
            //             this.channel = data.payload.channel;
            //             console.log("this.channel if",  this.channel);
                        
            //         }
            //         this.channelRevealed.next(true);
            //         this._navigationService.updateLeftMenuItem(true);
            //         this._changeDetectorRef.markForCheck();
            //     },
            //     error => {
            //         if (error === "Credit blance is low") {
            //             this.askForTopupOrUpgrade();
            //         }
            //     });
        if(this.dontShowMe?.dont_show_me_again==='1'){
            this._channelService.revealChannel(payload).subscribe(
                    data => {
                        this._notifyService.showSuccess(data.message, '');
                        console.log("data beforeif",data);
                        
                        if (channel.id === id) {
                           channel.is_revealed = true;
                            this.channell = data.payload.channel;
                            console.log("this.channel if",  this.channell);
                            
                        }
                        this.channelRevealed.next(true);
                        this._navigationService.updateLeftMenuItem(true);
                        this._changeDetectorRef.markForCheck();
                    },
                    error => {
                        if (error === "Credit blance is low") {
                            this.askForTopupOrUpgrade();
                        }
                    });
        }else{
            this.revealChannelPopup(id, credit_cost,channel)

        }
    //     }
    // });
}
}
channell:any

markFavourite(id) {
  console.log(this.channell);
  this._channelService.likeChannel({ channel_id: id }).subscribe(data => {
      // if (data.payload.channel_id === this.channel.id) {
      this.channell.is_favourite = true;
      // }
      this._changeDetectorRef.markForCheck();
      // this._notifyService.showSuccess(data.message, "Success");
  });
}

markUnFavourite(id) {
  this._channelService.dislikeChannel({ channel_id: id }).subscribe(data => {
      this.channell.is_favourite = false;
      this._changeDetectorRef.markForCheck();
      // this._notifyService.showWarning(data.message, "Warning");
  });
}

askForTopupOrUpgrade() {
  this.addCreditOrUpgradeForm = this._formBuilder.group({
      title: 'Low Credit Balance',
      message: 'You\'re currently low on credits. Consider upgrading your plan or buying more credits.',
      icon: this._formBuilder.group({
          show: true,
          name: 'heroicons_outline:badge-check',
          color: 'warn'
      }),
      actions: this._formBuilder.group({
          confirm: this._formBuilder.group({
              show: true,
              label: 'Upgrade Plan',
              color: 'primary'
          }),
          cancel: this._formBuilder.group({
              show: true,
              label: 'Buy Credits',
              color: 'warn'
          })
      }),
      dismissible: true
  });

  // Open the dialog and save the reference of it
  const dialogRef = this._bmiConfirmationService.open(this.addCreditOrUpgradeForm.value);
  dialogRef.afterClosed().subscribe((result) => {
      if (result === "confirmed") {
          this._router.navigateByUrl('/choose-plan');
      } else if (result === "cancelled") {
          this._matDialog.open(CreditTopupComponent, {
              autoFocus: false
          });
      }
  });
}



}