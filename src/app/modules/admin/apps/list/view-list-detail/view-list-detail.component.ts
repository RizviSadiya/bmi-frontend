import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { UserService } from 'app/core/user/user.service';
import { MatDialog } from '@angular/material/dialog';
import { CampaignsService } from '../../campaigns/campaigns.service';
import { InviteInfluencerPopupComponent } from 'app/layout/common/invite-influencer-popup/invite-influencer-popup.component';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BmiConfirmationService } from '@bmi/services/confirmation';
import { NotificationService } from 'app/core/services/notification.service';
import { Router } from '@angular/router';
import { QuickChatService } from 'app/layout/common/quick-chat/quick-chat.service';
import { InfluencerChannelService } from 'app/layout/common/influencer-channel/influencer-channel.service';
import { map } from 'lodash';
import { ListService } from '../list.service';

@Component({
  selector: 'app-view-list-detail',
  templateUrl: './view-list-detail.component.html',
  styleUrls: ['./view-list-detail.component.scss']
})
export class ViewListDetailComponent implements OnInit {

  channels:any=[];
  totalChannels: number = 0;
  liveCamp:number=0
listname
userPlan:any

userType: string = "INFLUENCER";
whatsappRequestForm: FormGroup;
publicForm: FormGroup;

  constructor(
    private _userService:UserService,
    private _navigationService:NavigationService,
    private _matDialog: MatDialog,
    private _campaignService: CampaignsService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _notifyService: NotificationService,
    private _router: Router,
    private _quickChatService: QuickChatService,
    private _channelService: InfluencerChannelService,
    private _listService: ListService,

    // : NotificationsService,
    // private _notifyService: NotificationsService,
    private _formBuilder: FormBuilder,
    private _bmiConfirmationService: BmiConfirmationService,



    ) { }

    pageSize=10;
currentPage=0
  ngOnInit(): void {
   let channelData = this._userService.getListData();
    // for (let index = 0; index < listdata.length; index++) {
    //     const element = listdata[index];
    //     console.log("element",element.channel);
    //     this.channels.push(element.channel)
    //   }
    this.channels= channelData.channelList
    this.totalChannels= channelData.totalCount
    this.listname= this._userService.getListname();
    this.userType = this._userService.userDetails.userType.toUpperCase();  
    this.userPlan = +this._userService.userDetails.plan_id;

    console.log("chnnels",this.channels);
    console.log("listname",this.listname);
     
        this._navigationService.getMenucount().subscribe(res=>{
            if(res.success){
                this.liveCamp= res.payload.campaign
            }
        })
        console.log("liveCamp",this.liveCamp);
        
  }

  pageIndex: number = 0;

  onChangePage(event){
    console.log("event",event);
    
    this.pageIndex = event.pageIndex;
    // this.getMylistFromServer();
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize
    let payload={
        "id":this.channels[0].list_id,
        "page":this.pageIndex+1,
        "perPage":'10'
    }
   this._listService.getViewListsDetails(payload).subscribe((res:any[])=>{
this.channels= res['payload'].channelList

   })
}

  inviteAll(channel) {
    if (!this.campaigns) {
        let payload = {
            "status": "1",
            "page": "1",
            "perPage": "10",
            "plateform_type":this.listname.plateform_type
        };
        this._campaignService.getCampaigns(payload).subscribe(data => {
            this.campaigns = data['payload'].campaign;
            this._changeDetectorRef.markForCheck();
            this.openInvitationPopup("All");
        });
    } else {
        this.openInvitationPopup("All");
    }
}
campaigns: any;

openInvitationPopup(channel) {
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
                channel:channel,
                plateform_type:this.listname.plateform_type,
                list_id:this.listname.id
                // influ_id:channel.influ_id
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
        // this._notifyService.showInfo("You don't have any active campaign to send invite ", "");
    }
}

notification(){
  if(this.userPlan===1){
      this.publicForm = this._formBuilder.group({
          title: 'WhatsApp Request',
          message: 'This feature is not available on your plan, to enable this feature you must upgrade your plan.',
          // message: 'Only paid users can use this feature.',
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
              this._router.navigate(['/choose-plan'])
          }
      });
     
  }
  // if(this.userPlan===1){
  //     this._notifyService.showError("we should prompt user to upgrade as this feature is only for paid plans.","Error")
  //     this.campaignForm.get('step2').get('visibility').setValue(this.userPlan)
  // }
  // console.log("planId",this.campaignForm.get('step2').get('visibility').value,)
}

openQuickChat(user_id) {
  console.log("openQuickChat", user_id);
  
  this._quickChatService.getChatById(user_id).subscribe();;
}

similarInfluencer:any

showSimilar(channel){
    if(!channel.is_revealed){
        // this.un_revealchannel()
    }
    else{
        let payload={
            "search_keyword":channel.tags,
            "page":'1',
            "perPage":'10'
    }

    this._campaignService.showSimilar(payload).subscribe(res=>{
        if(res.success){
            this.similarInfluencer=res.payload
            console.log("similarInfluencer",this.similarInfluencer);
            
            // console.log("res",this.similarInfluencer);
            this._campaignService.setSimilardata(this.similarInfluencer)
            this._campaignService.setSimilarcatdata(channel.tags)
            this._router.navigate(['/pages/similarInfluencer'])
            // this.showSimilarOPenpopup()
        }else{
            this._notifyService.showError(res.message, 'error')
        }
    })
    }
  
  
}
channelfavourite:any
markFavourite(id) {
    console.log(this.channels);
    this._channelService.likeChannel({ channel_id: id }).subscribe(data => {
        // if (data.payload.channel_id === this.channel.id) {
 console.log("data",data);
 
   
        this.channels.is_favourite = true;
        // this.channels.is_favourite = data.payload.channel
    
        // }
        this._changeDetectorRef.markForCheck();
        this._navigationService.updateLeftMenuItem(true);

        // this._notifyService.showSuccess(data.message, "Success");
    });
}

markUnFavourite(id) {
    this._channelService.dislikeChannel({ channel_id: id }).subscribe(data => {
// this.channels.map(channel=> channel.is_favourite==false)

        this.channels.is_favourite = false;
        // this.channelfavourite = false

        this._changeDetectorRef.markForCheck();
        this._navigationService.updateLeftMenuItem(true);

        // this._notifyService.showWarning(data.message, "Warning");
    });
}


whatsappRequest(channel){
  if(this.userPlan===1){
      this.notification()
  }
  else{
      this.whatsappRequestForm = this._formBuilder.group({
          title: 'WhatsApp Request',
          message: 'Are you sure you want to send WhatsApp Request?',
          icon: this._formBuilder.group({
              show: true,
              name: 'fab fa-whatsapp',
              // data:"ph:whatsapp-logo",
              // material:'WhatsApp',
              color: 'success'
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
 
}

}
