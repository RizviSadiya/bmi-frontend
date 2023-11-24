import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, ElementRef,ViewChild,Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { shareReplay, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep, lowerFirst } from 'lodash-es';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { BmiConfirmationService } from '@bmi/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { Channel } from 'app/layout/common/channel/all-channels.types';
import { ChannelPricePopupComponent } from 'app/layout/common/channel-price-popup/channel-price-popup.component';
import { InfluencerChannelService } from 'app/layout/common/influencer-channel/influencer-channel.service';
import { NotificationService } from 'app/core/services/notification.service';
import { DashboardService } from 'app/modules/admin/dashboard/dashboard.service';
import { VerifyChannelPopupComponent } from 'app/layout/common/verify-channel-popup/verify-channel-popup.component';
import { InviteInfluencerPopupComponent } from '../../invite-influencer-popup/invite-influencer-popup.component';
import { ListSelectionPopupComponent } from '../../list-selection-popup/list-selection-popup.component';
import { CampaignsService } from 'app/modules/admin/apps/campaigns/campaigns.service';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { QuickChatService } from '../../quick-chat/quick-chat.service'; 
import { CreditTopupComponent } from 'app/layout/common/credit-topup/credit-topup.component';
// import { ReviewProposalComponent } from '../review-proposal/review-proposal.component';
import { ViewProposalComponent } from '../view-proposal/view-proposal.component'; 
// import { SuggestedInviteListComponent } from 'app/modules/admin/apps/suggested-invite-list/suggested-invite-list.component';
import { PageEvent } from '@angular/material/paginator';
// import WhatsAppIcon from '@mui/icons-material/WhatsApp';

@Component({
  selector: 'influencer-insta-proposal',
  templateUrl: './influencer-insta-proposal.component.html',
  styleUrls: ['./influencer-insta-proposal.component.scss']
})
export class InfluencerInstaProposalComponent implements OnInit ,OnDestroy {

 
  @Input() channel: any;
  @Input() application: any;
  @Input() list: any;
  @Input() response: any={}
  @Input() mode: string;
  @Input() bidAmount: number;
  @Output() viewClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() hireClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() shortlistClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() defaultChannelChanged: EventEmitter<number> = new EventEmitter<number>();
  @Output() channelDeleted: EventEmitter<number> = new EventEmitter<number>();
  @Output() channelRevealed: EventEmitter<boolean> = new EventEmitter<boolean>();
  userType: string = "INFLUENCER";
  removeChannelForm: FormGroup;
  defaultChannelForm: FormGroup;
  revealChannelForm: FormGroup;
  publicForm: FormGroup;
  addCreditOrUpgradeForm: FormGroup;
  whatsappRequestForm: FormGroup;
  campaigns: any;
  userLists = [];
  userData: any
  engageRate: any;
  userDetails: any;
  ViewProposalData:any
  pageSize = 5;
  currentPage = 0;
  totalCampaignsCount: number = 0;
  lowValue: number = 0;
  highValue: number = 5;
  userPlan: number = 1;
  constructor(
      private _changeDetectorRef: ChangeDetectorRef,
      private _bmiConfirmationService: BmiConfirmationService,
      private _matDialog: MatDialog,
      private _formBuilder: FormBuilder,
      private _router: Router,
      private _userService: UserService,
      private _channelService: InfluencerChannelService,
      private _dashboardService: DashboardService,
      private _notifyService: NotificationService,
      private _campaignService: CampaignsService,
      private _navigationService: NavigationService,
      private _quickChatService: QuickChatService,
      
  ) { }
  selectedList
  n
  channel_lang : "{\"Hindi\":22,\"Gujarati\":3,\"German\":1,\"Undefined\":1,\"Danish\":1}"
TAGS:any=[]
  ngOnInit(): void {    
     
      //   console.log("sadiya",this.channel)
      //   console.log("application",this.application)
        // console.log("response",this.application)
      //   let lang = JSON.parse(this.channel_lang)
      //   console.log("lang",lang)
      //   console.log("channel.channel_lang",JSON.parse(this.channel.channel_lang))
      // const resultArray = Object.keys(this.channel_lang).map(index => {
      //     let person = this.channel_lang[index];
      //   console.log("resultArray",resultArray)
          
      //     return person;
      // });
        this.userType = this._userService.userDetails.userType.toUpperCase();  
        this.userDetails = this._userService.userDetails  
      this.userPlan = +this._userService.userDetails.plan_id;

      //   console.log("userDetails",this.userDetails)    
      //   let abc = this.channel.EngagementRate.split('%')
      //   this.engageRate =  abc[0]   
        this.TAGS=this.channel?.tag_category?.split(',')
      // this.TAGS.push(this.channel?.tag_category)
    //   console.log("TAGS",this.TAGS);
      
         this.selectedList =this.list?.filter(item=>item.channel_id== this.channel.id)
      //   console.log("userLists",this.selectedList)    
      //   this.selectedList.map(res=>{
      //     res.selected =true
      //     // console.log("select",select);
          
      //   })
      // for (let index = 0; index < this.list.length; index++) {
      //     this.selectedList = this.list[index];
      //   console.log("this.selectedList",this.selectedList)
          
      // }
      // this.selectedList = this.list.toString();
      //   console.log("this.selectedList",this.selectedList)

      // const found = this.userLists.some(r=> this.list.includes(r.list_id))
      // console.log("found",found);
      
      // var n = this.list.includes(this.selectedList.list_id);
      //   console.log("n",n)

      // in_array('1',['1','2','3','4'])
      // var result = this.userLists.filter(function (o1) {
      //     return this.list.some(function (o2) {
      //         return o1.id === o2.id; // return the ones with equal id
      //    });

      // });
      // console.log("result",result)

      // let result = this.userLists.filter(o1=>o1);
      //   console.log("result",result)


          // this._campaignService.ViewProposal(this.response.id).subscribe(res=>{
          //     if(res.success){
          //         this.ViewProposalData=res.payload.application
                
          //     }
          // })
      this._userService.user$.subscribe(data => {
          this.userData = data
        
      });
    
  }

  similarInfluencer:any
  showSimilar(channel){
    
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
  // showSimilarOPenpopup(){
  //     const procePopupDialog = this._matDialog.open(SuggestedInviteListComponent ,{
  //         autoFocus: false,
  //         data: this.similarInfluencer
  //     });
  //     procePopupDialog.afterClosed().subscribe(result => {
     
  //     })
  // }
  

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
          "perPage": this.pageSize,
          "page": this.currentPage +1,
          // "limit": this.pageSize,
          // "offset": this.currentPage * this.pageSize,
          "status": this.status,

      }
      // this._campaignsService.getCampaigns(payload).subscribe((data) => {
      //     this._changeDetectorRef.markForCheck();
      // });
      this._campaignService.getCampaigns(payload).subscribe();
      // this.callInitData();
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

  whatsappRequest(){
      if(this.userPlan===1){
          this.notification()
      }
      else{
          this.whatsappRequestForm = this._formBuilder.group({
              title: 'WhatsApp Request',
              message: 'Are you sure you want to send WhatsApp Request?',
              icon: this._formBuilder.group({
                  show: false,
                  name: 'heroicons_solid:whatsapp',
                  color: 'warn'
                  // data:"ph:whatsapp-logo",
                  // material:'WhatsApp',
   
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
                      "channel_id":this.channel.channel_id
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

  topdiv(el:HTMLElement){
      el.scrollIntoView({ behavior: 'smooth' });
  }

  revealChannel(id, credit_cost,channel,el:HTMLElement) {
      console.log("channel",channel);
      
      // if (this.userData.plan_id === 1 || this.userData.plan_id === 2 && channel.EstViews > 50000) {

      //     this.publicForm = this._formBuilder.group({
      //         title: 'Upgrade Plan',
      //         message: ' 50K+ Channel Reveal, is not for Free plan , it is only for Starter or bussiness plan.',
      //         icon: this._formBuilder.group({
      //             show: true,
      //             name: 'heroicons_outline:exclamation',
      //             color: 'warn'
      //         }),
      //         actions: this._formBuilder.group({
      //             confirm: this._formBuilder.group({
      //                 show: true,
      //                 label: 'Upgrade Plan',
      //                 color: 'success'
      //             }),
      //             cancel: this._formBuilder.group({
      //                 show: true,
      //                 label: 'Cancel'
      //             })
      //         }),
      //         dismissible: true
      //     });
  
      //     // Open the dialog and save the reference of it
      //     const dialogRef = this._bmiConfirmationService.open(this.publicForm.value);
  
      //     // Subscribe to afterClosed from the dialog reference
      //     dialogRef.afterClosed().subscribe((result) => {
      //         if (result === "confirmed") {
              
      //             // this._campaignService.DeleteProposal(this.application.id).subscribe(res=>{
      //             //     if(res.code==200){
      //             //        this.toaster.success(res.message)
      //             //         this.getList.emit()
      //             //         window.location.reload()
      //             //     console.log("this.getList",this.getList.emit())
      //             //     }
      //             //     else{
      //             //       this.toaster.error(res.message)
      //             //     }
      //             // })
      //             this._channelService.setPlantype("upgradePlan")
      //             this._router.navigate(['/choose-plan'])
      //         }
      //     });
         
      // } else {
          this.revealChannelForm = this._formBuilder.group({
              title: 'Reveal Channel',
              message: 'Are you sure you want to reveal this channel using <strong>' + credit_cost + ' credits</strong>?',
              icon: this._formBuilder.group({
                  show: true,
                  name: 'heroicons_outline:badge-check',
                  color: 'primary'
              }),
              actions: this._formBuilder.group({
                  confirm: this._formBuilder.group({
                      show: true,
                      label: 'Yes, Proceed',
                      color: 'primary'
                  }),
                  cancel: this._formBuilder.group({
                      show: true,
                      label: 'No, Cancel'
                  })
              }),
              dismissible: true
          });

      // }
      // Open the dialog and save the reference of it
      const dialogRef = this._bmiConfirmationService.open(this.revealChannelForm.value);

      // Subscribe to afterClosed from the dialog reference
      dialogRef.afterClosed().subscribe((result) => {
          if (result === "confirmed") {
              let payload = {
                  "channel_id": id,
                  "plateform_type":2
              };
              console.log("payload",payload);
              
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
              this._channelService.revealChannel(payload).subscribe(
                  data => {
                      this._notifyService.showSuccess(data.message, "");
                      console.log("data beforeif",data);
                      
                      if (channel.id === id) {
                         channel.is_revealed = true;
                          this.channel = data.payload.channel;
                          console.log("this.channel if",  this.channel);
                          
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
          }
      });
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
                  channel:channel,
                  // influ_id:channel.influ_id
              }
          });

          inviteChannelPopup.afterClosed().subscribe(response => {
              if (response) {
                  
                  // Invite Channel popup closed, update the UI
                  if (this.channel.id === channel.id) {
                      this.channel.is_invite = true;
                  }
                  this._changeDetectorRef.markForCheck();
              }
          });
      } else {
          this._notifyService.showInfo("You don't have any active campaign to send invite ", "");
      }
  }

  verifyInfChannel() {
      const verifyChannelPopup = this._matDialog.open(VerifyChannelPopupComponent, {
          maxHeight: '95vh',
          width: '80vw',
          autoFocus: true,
          disableClose: true,
          data: {
              channel: this.channel
          }
      });

      verifyChannelPopup.afterClosed().subscribe(response => {
          if (response.success) {
              // Verify Channel popup closed, Update the UI
              console.log("response.payload",response.payload)
              if (this.channel.id === response.payload.id) {
                  this.channel.is_verified ;
                
              }
              this._notifyService.showSuccess(response.message, "");
              this._changeDetectorRef.markForCheck();
          }
      window.location.reload();

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

  onViewClick() {
      this.viewClicked.next(true);
  }

  onHireClick() {
      this.hireClicked.next(true);
      let test2=this._campaignService.setHireapplicationData(this.application)
      let test=this._campaignService.setHirechannelData(this.channel)
    //   console.log('abhi',this.campaigns);
  }

  onShortlistClick() {
      this.shortlistClicked.next(true);
      // window.location.reload();
  }

  ProposalClick(){
    console.log("this.response.plateform_type",this.response.plateform_type);
        
        let payload={
            "id":this.response.application_id,
            "plateform_type":2
        }
      this._campaignService.ViewProposal(payload).subscribe(res=>{
              if(res.success){
                  this.ViewProposalData=res.payload
      this.onProposalClick()

              }
          })
  }
  onProposalClick(){
     
      const procePopupDialog = this._matDialog.open(ViewProposalComponent ,{
          autoFocus: false,
          data: this.ViewProposalData
      });
      procePopupDialog.afterClosed().subscribe(result => {
     
      })
  }

  changePrice(channel): void {
      const procePopupDialog = this._matDialog.open(ChannelPricePopupComponent, {
          autoFocus: false,
          data: {
              channel: cloneDeep(channel)
          }
      });
      procePopupDialog.afterClosed().subscribe(result => {
          if (result) {
console.log("result",result);

              if (result != channel.promotion_price) {
                  let payload = {
                      "id": channel.id,
                      "promotion_price": result.amount,
                      "is_default": channel.is_default,
                      "currency":result.currency
                  };
                  this._channelService.updateChannel(payload).subscribe(
                      data => {
                          // this.loading = false;
                          console.log(data);
                          this.channel.promotion_price = result.amount;
                  this._notifyService.showSuccess(data.message, "");
                          window.location.reload()
                          this._changeDetectorRef.markForCheck();
                      });
              } else {
                  this._notifyService.showWarning("Video Promotion Price not changed", "Warning");
              }
          }
      })
  }

  /**
   * Open RemoveChannel dialog
   */
  openRemoveChannelDialog(channel: Channel): void {
      this.removeChannelForm = this._formBuilder.group({
          title: channel.title,
          message: 'Are you sure you want to remove this channel?',
          icon: this._formBuilder.group({
              show: true,
              name: 'heroicons_outline:exclamation',
              color: 'warn'
          }),
          actions: this._formBuilder.group({
              confirm: this._formBuilder.group({
                  show: true,
                  label: 'Remove',
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
      const dialogRef = this._bmiConfirmationService.open(this.removeChannelForm.value);

      // Subscribe to afterClosed from the dialog reference
      dialogRef.afterClosed().subscribe((result) => {
          if (result === "confirmed") {
              let payload = {
                  "channel_id": channel.id
              };
              this._channelService.deleteChannel(payload).subscribe(
                  data => {
                      this._notifyService.showSuccess(data.message, "");
                      this.channelDeleted.next(channel.id);
                      this._changeDetectorRef.markForCheck();
                  });
          }
      });
  }

  /**
   * Open MarkDefaultChannel dialog
   */
  openMarkDefaultChannelDialog(channel: Channel): void {
      this.defaultChannelForm = this._formBuilder.group({
          title: 'Make Channel as Primary',
          message: 'Are you sure you want to make this channel your primary channel?',
          icon: this._formBuilder.group({
              show: true,
              name: 'heroicons_outline:badge-check',
              color: 'primary'
          }),
          actions: this._formBuilder.group({
              confirm: this._formBuilder.group({
                  show: true,
                  label: 'Save',
                  color: 'primary'
              }),
              cancel: this._formBuilder.group({
                  show: true,
                  label: 'Cancel'
              })
          }),
          dismissible: true
      });

      // Open the dialog and save the reference of it
      const dialogRef = this._bmiConfirmationService.open(this.defaultChannelForm.value);

      // Subscribe to afterClosed from the dialog reference
      dialogRef.afterClosed().subscribe((result) => {
          if (result === "confirmed") {
              let payload = {
                  "id": channel.id,
                  "promotion_price": channel.promotion_price,
                  "is_default": "1"
              };
              this._channelService.updateChannel(payload).subscribe(
                  data => {
                      this._notifyService.showSuccess(data.message, "");
                      this.defaultChannelChanged.next(channel.id);
                      this.channel.is_default = 1;
                      this._userService.updateUserDetailsInLocalStorage('profile_photo', data.payload.image);
                      this._changeDetectorRef.markForCheck();
                  });
          }
      });
  }

  markFavourite(channel) {
      console.log(this.channel);
      let payload={
        "channel_id":channel.id,
        "plateform_type": channel.plateform_type  
       }
      this._channelService.likeChannel(payload).subscribe(data => {
          // if (data.payload.channel_id === this.channel.id) {
          this.channel.is_favourite = true;
          // }
          this._changeDetectorRef.markForCheck();
          this._navigationService.updateLeftMenuItem(true);

          // this._notifyService.showSuccess(data.message, "Success");
      });
  }

  markUnFavourite(channel) {
    let payload={
        "channel_id":channel.id,
        "plateform_type": channel.plateform_type  
       }
      this._channelService.dislikeChannel(payload).subscribe(data => {
          this.channel.is_favourite = false;
          this._changeDetectorRef.markForCheck();
          this._navigationService.updateLeftMenuItem(true);

          // this._notifyService.showWarning(data.message, "Warning");
      });
  }

  Search:any
  channel_id
  channel_name
  checkListAndAdd(channel_id, channel_name) {
      let  payload={
          "channel_id":channel_id
      }
      this._dashboardService.getUserCreatedLists(payload).subscribe(data => {
          if (data.success) {
              this.userLists = data.payload.list;
              // this.addToList(channel_id, channel_name);
              console.log("userLists",this.userLists)
              
              this._changeDetectorRef.markForCheck();
              this.channel_name=channel_name
              this.channel_id=channel_id
              // let result = result1.filter(o1 => result2.some(o2 => o1.id === o2.id));

              this.selectedList = this.userLists.filter(o1=>this.list.some(o2=>o1.id ===o2.list_id));
              console.log("selectedList",this.selectedList)
              // console.log("userLists",this.userLists)
              // this.userLists.map(res=>{
              //     res.selectedlist=this.selectedList.list_data.list_id
              // })
          //    let selectid =this.selectedList.filter(id=>id==id)
          //     console.log("selectid",selectid)
              // var alphaNumeric = this.userLists.concat(this.selectedList); 
              for (let index = 0; index < this.userLists.length; index++) {
                  const element = this.userLists[index];
                      console.log("element ", element );
                    
                      // newArray.push(element)
                  for (let index = 0; index < element.list_data.length; index++) {
                      const element2 = element.list_data[index];
                      console.log("element2 ", element2 );
                      this.newArray.push(element2)
                      console.log("newArray ", this.newArray );
                      
                  }
              }
              var alphaNumeric = this.userLists+this.selectedList
console.log("alphaNumeric : " + alphaNumeric );
          }
      });
  }
  newArray=[]
  getShortName(name) { 
      let num= name?.split(' ')
      let userName = num[0]
      // console.log("userName",userName);
      
      return userName.split(' ').map(n => n[0]).join('');
    }

    proceed(list): void {
      // this.listError = null;
      // this.submitted = true;
      // if (this.listForm.invalid) {
      //     this.listError = "Please select at least one value";
      //     return;
      // }
      console.log("list",list);
      

      let payload = {
          "list_id": list.id.toString(),
          "channel_id": this.channel_id
      }

      this._dashboardService.addChannelToList(payload).subscribe(data => {
          if (data.success) {
              // this._matDialog.close(true);
              this._notifyService.showSuccess(data.message, "");
              window.location.reload();
          }
      });
  }

  userFilter: any = { name: '' };
  addToList(channel_id, channel_name) {
      // if (this.userLists.length > 0) {
      const selectListDialog = this._matDialog.open(ListSelectionPopupComponent, {
          autoFocus: false,
          data: {
              userLists: this.userLists,
              channelId: cloneDeep(this.channel_id),
              channelName: this.channel_name
          }
      });
      // } else {
      // Open create list popup
      // }
  }

  openQuickChat(user_id) {
      console.log("openQuickChat", user_id);
      let payload = {
        "channel_id":user_id.channel_id,
        "plateform_type":user_id.plateform_type,
        "user_id":user_id.influ_id
      }
      this._quickChatService.getChatByChannelId(payload).subscribe();
    //   this._quickChatService.getChatById(user_id).subscribe();

  }

  ngOnDestroy(): void { }
}
