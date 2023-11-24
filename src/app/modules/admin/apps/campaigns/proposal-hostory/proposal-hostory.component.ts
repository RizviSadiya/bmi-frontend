
import { ChangeDetectionStrategy, ChangeDetectorRef,Input, Inject , Component, OnDestroy, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
// import { WalletService } from '../wallet/wallet.service';
import { NotificationService } from 'app/core/services/notification.service';
import { UserService } from 'app/core/user/user.service';
import { WalletHistoryService } from 'app/modules/admin/apps/wallet/history/history.service';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { AppConstant } from 'app/app.constants';
// import { PricingPlanService } from '../pricing-plan/pricing-plan.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CampaignsService } from 'app/modules/admin/apps/campaigns/campaigns.service';
declare var Razorpay: any;
import { Channel } from 'app/layout/common/channel/all-channels.types';
import { BmiAlertType } from '@bmi/components/alert';

@Component({
  selector: 'app-proposal-hostory',
  templateUrl: './proposal-hostory.component.html',
  styleUrls: ['./proposal-hostory.component.scss']
})
export class ProposalHostoryComponent implements OnInit {
  userPlan: number = 1;
    planDetails: any;
  proposalhistory:any
  channel : Channel;
  @Output() hireClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialogRef: MatDialogRef<ProposalHostoryComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        // private _walletService: WalletService,
        private _notifyService: NotificationService,
        private _campaignService: CampaignsService,
        private _userService: UserService,
        private _walletHistoryService: WalletHistoryService,
        private _navigationService: NavigationService,
        // private _planService: PricingPlanService,
    ) { }
  historyMessage:any
    ngOnInit(): void {
        this.userPlan = this._userService.userDetails.plan_id;
        console.log("data",this.data)
        let payload={
          "camp_id":this.data.id,
          "status":5,
          "plateform_type":this.data.plateform_type
        }
        this._campaignService.ProposalHistroy(payload).subscribe(res=>{
          if(res){
            this.proposalhistory=res.payload.applications
            // this.channel= this.proposalhistory.filter(channel=>channel.channel)
            console.log("proposalhistory",this.proposalhistory);
            console.log("channel",this.channel);
            
          }
        }
        , (error) => {
          console.log("res",error);
          this.proposalhistory=[]
          this.historyMessage=error
          console.log("historyMessage",this.historyMessage);
          console.log("proposalhistory",this.proposalhistory);
          
          
      })
    
        // this._planService.getPlanList().subscribe(data => {
        //     this.planDetails = data.payload.filter(plan => plan.id === this.userPlan)[0];
        //     this._changeDetectorRef.markForCheck();
        // });
    }

    onHireClick() {
      this.hireClicked.next(true);
  }

    proceed(): void {
        let payload = { plan_id: this.userPlan };

        // this._walletService.subscribeTopup(payload).subscribe(data => {
        //     if (data.success) {
        //         this._matDialogRef.close(true);
        //         let me = this;
        //         let options = {
        //             "key": AppConstant.RAZOR_PAY.RAZOR_API_KEY,
        //             "amount": data.payload.order_detail.amount,
        //             "currency": data.payload.order_detail.currency,
        //             "name": AppConstant.RAZOR_PAY.WEBSITE_NAME,
        //             "description": AppConstant.RAZOR_PAY.WEBSITE_DESCRIPTION,
        //             "image": AppConstant.RAZOR_PAY.WEBSITE_LOGO,
        //             "order_id": data.payload.order_detail.order_id,
        //             "handler": function (response) {
        //                 me.handlePaymentGatewayResponse(response);
        //             },
        //             "prefill": {
        //                 "name": me._userService.userDetails.fullname,
        //                 "email": me._userService.userDetails.email,
        //                 "contact": me._userService.userDetails.phone
        //             },
        //             "notes": {
        //                 "address": "note value"
        //             },
        //             "theme": {
        //                 "color": AppConstant.RAZOR_PAY.THEME_COLOR
        //             }
        //         };
        //         let rzp1 = new Razorpay(options);
        //         rzp1.open();
        //     }
        // });
    }

    handlePaymentGatewayResponse(response) {
        // let me = this;
        // let tnxPayload = {
        //     payment_id: response.razorpay_payment_id,
        //     order_id: response.razorpay_order_id,
        //     signature: response.razorpay_signature
        // }
        // me._walletService.storeTopupResponse(tnxPayload).subscribe(result => {
        //     if (result.success) {
        //         me._notifyService.showSuccess(result.message, "success");
        //         me._navigationService.updateLeftMenuItem(true);
        //     }
        // });
    }

    ngOnDestroy(): void {

    }
}