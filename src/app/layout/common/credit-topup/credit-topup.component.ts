import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { WalletService } from '../wallet/wallet.service';
import { NotificationService } from 'app/core/services/notification.service';
import { UserService } from 'app/core/user/user.service';
import { WalletHistoryService } from 'app/modules/admin/apps/wallet/history/history.service';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { AppConstant } from 'app/app.constants';
import { PricingPlanService } from '../pricing-plan/pricing-plan.service';

declare var Razorpay: any;

@Component({
    selector: 'credit-topup',
    templateUrl: './credit-topup.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./credit-topup.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditTopupComponent implements OnInit, OnDestroy {
    userPlan: number = 1;
    userCurrency: any
    planDetails: any;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialogRef: MatDialogRef<CreditTopupComponent>,
        private _walletService: WalletService,
        private _notifyService: NotificationService,
        private _userService: UserService,
        private _walletHistoryService: WalletHistoryService,
        private _navigationService: NavigationService,
        private _planService: PricingPlanService,
    ) { }
    gstAmount: number
    addgst: number
    gst_tax
    ngOnInit(): void {
        this.userPlan = this._userService.userDetails.plan_id;
        this.userCurrency = this._userService.userDetails
        this._planService.getPlanList().subscribe(data => {
            this.planDetails = data.payload.filter(plan => plan.id === this.userPlan)[0];
            this._changeDetectorRef.markForCheck();
            console.log("planDetails", this.planDetails);

this.gst_tax= JSON.parse(sessionStorage.getItem('website'))
          




        });
    }

    Inrvalue: number = 7500;
    decvalue: number = 7500;
    usd_credit: number = 31;
    inr_credit: number = 2500;
    amount: any
    payableAmount=2950
    incrementValue(step: number = 1, usd_credit, type,inr_credit): void {
console.log("usd_credit",usd_credit);

        if (type === "incr") {
            let inputValue = this.Inrvalue + step;
            this.Inrvalue = step + 7500;


            this.usd_credit =  usd_credit + 30.49
            this.inr_credit =  inr_credit  + 2500 
            this.gstAmount = (this.inr_credit * this.gst_tax.tax_per) / 100;
            console.log("gstAmount", this.gstAmount);
            this.payableAmount = this.inr_credit+this.gstAmount
            console.log("payableAmount",this.payableAmount)
        }
        else {
            if(this.Inrvalue === 7500){
                return 
            }
            let inputValue = this.Inrvalue + step;
            this.Inrvalue = step - 7500;


            this.usd_credit =  usd_credit - 30.49
            this.inr_credit =  inr_credit  - 2500 
            this.gstAmount = (this.inr_credit * 18) / 100;
            console.log("gstAmount", this.gstAmount);
           this.payableAmount = this.inr_credit+this.gstAmount
            //  console.log("inputValue",inputValue)
            console.log("payableAmount",this.payableAmount)

        }
        console.log("step", step);



    }

    //       decrementValue(step):void{
    //         console.log("step",step);

    //         let inputValue = this.Inrvalue - this.Inrvalue;
    //         this.Inrvalue = this.Inrvalue - step;
    //     this.usd_credit = this.usd_credit - this.usd_credit
    //     this.inr_credit = this.inr_credit - this.inr_credit
    //      console.log("inputValue",inputValue);
    //       }

    // incrementValue(type : any){
    //     var initialVal = 7500
    //     if(type == "incr"){
    //         // this.Inrvalue = initialVal
    //        console.log( initialVal + 7500)

    //         // console.log(this.Inrvalue + 7500)
    //     }else{
    //         console.log( initialVal - 7500, "elae par")
    //     }
    // }

    proceed(): void {
        if (this.userCurrency.currency === 'INR') {
            // this.amount = 5000
            this.amount =this.inr_credit
          

        } else {
            // this.amount = 100
            this.amount = this.usd_credit
         

        }
        let payload = {
            currency: this.userCurrency.currency,
            amount: this.amount,
            credits: this.Inrvalue
        };
        // let payload = { plan_id: this.userPlan,  };

        this._walletService.subscribeTopup(payload).subscribe(data => {
            if (data.success) {
                this._matDialogRef.close(true);
                let me = this;
                let options = {
                    "key": AppConstant.RAZOR_PAY.RAZOR_API_KEY,
                    "amount": data.payload.order_detail.amount,
                    "currency": this.userCurrency.currency,
                    "name": AppConstant.RAZOR_PAY.WEBSITE_NAME,
                    "description": AppConstant.RAZOR_PAY.WEBSITE_DESCRIPTION,
                    "image": AppConstant.RAZOR_PAY.WEBSITE_LOGO,
                    "order_id": data.payload.order_detail.order_id,
                    "handler": function (response) {
                        me.handlePaymentGatewayResponse(response);
                    },
                    "prefill": {
                        "name": me._userService.userDetails.fullname,
                        "email": me._userService.userDetails.email,
                        "contact": me._userService.userDetails.phone
                    },
                    "notes": {
                        "address": "note value"
                    },
                    "theme": {
                        "color": AppConstant.RAZOR_PAY.THEME_COLOR
                    }
                };
                let rzp1 = new Razorpay(options);
                rzp1.open();
            }
        });
    }

    handlePaymentGatewayResponse(response) {
        let me = this;
        let tnxPayload = {
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature
        }
        me._walletService.storeTopupResponse(tnxPayload).subscribe(result => {
            if (result.success) {
                me._notifyService.showSuccess(result.message, "");
                me._navigationService.updateLeftMenuItem(true);
            }
        });
    }

    ngOnDestroy(): void {

    }
}