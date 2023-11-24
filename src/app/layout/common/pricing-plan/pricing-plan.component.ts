import { ChangeDetectionStrategy, Component, ViewEncapsulation, OnInit, ChangeDetectorRef } from '@angular/core';

import { PricingPlanService } from './pricing-plan.service';
import { UserService } from 'app/core/user/user.service';
import { AppConstant } from 'app/app.constants';
import { Router } from '@angular/router';
import { InfluencerChannelService } from '../influencer-channel/influencer-channel.service';
import { NotificationService } from 'app/core/services/notification.service';
import { timeout } from 'rxjs/operators';

declare var Razorpay: any;

@Component({
    selector: 'pricing-plan',
    templateUrl: './pricing-plan.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PricingPlanComponent implements OnInit {
    inrSelection: boolean = true;
    planList: any=[];
    userDetails: any;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _planService: PricingPlanService,
        private _userService: UserService,
        private _influService: InfluencerChannelService,
        private _route:Router,
       private _notifyService:NotificationService
    ) { }
    amount:any
    yearly_gstAmount:number
    month_gstAmount:number
    perMonnth_gst:number
    gstPer:any
    addgst:number
    monthly_amount
    ngOnInit(): void {
        this.userDetails = this._userService.userDetails;
        console.log("userDetails.currency",this.userDetails.currency);
        let planType =this._influService.getPlantype()
        console.log("planType",planType);
        this.gstPer = JSON.parse(sessionStorage.getItem('website'))
        // if(planType==="upgradePlan" && this.userDetails.plan_id===1 ){
        //     this._route.navigate(['/choose-plan'])

        // }
        // if(this.userDetails.plan_id===1){
        //     this._route.navigate(['/dashboard'])
        // }

        if (!this.userDetails.plan_id) {
            this.userDetails.plan_id = 0;
        }
        this._planService.getPlanList().subscribe(data => {
            this.planList = data.payload;
            this.planList.map(plan=>{
                plan.gstAmount=this.addgst
            })
          this.planList.filter(plan=>{ 
            this.amount =plan
                console.log("plan",plan);
                console.log("amount",this.amount.price/12);
                this.perMonnth_gst = this.amount.price/12

this.monthly_amount=(this.perMonnth_gst * this.gstPer.tax_per) / 100;
                console.log("monthly_amount",this.monthly_amount);
                this.addgst= this.perMonnth_gst + this.monthly_amount
                plan.monthly_gstAmount=this.monthly_amount
                plan.monthpayableAmount =this.perMonnth_gst + this.monthly_amount

this.yearly_gstAmount=(this.amount.price * this.gstPer.tax_per) / 100;
                console.log("gstAmount",this.yearly_gstAmount);
                this.addgst= this.amount.price + this.yearly_gstAmount
                plan.yearly_gstAmount=this.yearly_gstAmount
                plan.payableAmount =this.amount.price + this.yearly_gstAmount
                console.log("addgst",this.addgst);
               
        // let payload={
        //     from:'INR',
        //     to:this.userDetails.currency,
        //     amount:this.amount.price
        // }
        // console.log("payload",payload);
        
        // this._planService.currencyConvert(payload).subscribe(res=>{
        //     if(res.success){
        //         this.convertedAmount=res.payload
        //         console.log("convertedAmount",this.convertedAmount);
                
        //     }
        // })
               
            })
            
            this._changeDetectorRef.markForCheck();
        });

    }

    selectPlan(plan: number) {
        let payload = { plan_id: plan };
        this._planService.subscribeChannel(payload).subscribe(data => {
            if (data.payload.subscription.subscription_plan_id === 1) {
                // Free Plan selected by user, redirect to dashboard page
                location.href = '/dashboard';
            } else {
                this.openPaymentGateway(data);
            }
        });
    }

    upgradePlan(plan: number) {
        if (plan > 1) { // If plan is not free plan
            let payload = { plan_id: plan };
            this._planService.subscribeChannel(payload).subscribe(data => {
                this.openPaymentGateway(data);
            });
        }
    }

    convertedAmount:any
    currencyConvert(){
        let payload={
            from:'INR',
            to:this.userDetails.currency,
            amount:this.amount.price
        }
        console.log("payload",payload);
        
        // this._planService.currencyConvert(payload).subscribe(res=>{
        //     if(res.success){
        //         this.convertedAmount=res.payload
        //         console.log("convertedAmount",this.convertedAmount);
                
        //     }
        // })
    }
msg:any
    openPaymentGateway(data: any) {
        // Open payment Gateway
        let me = this;
        let options = {
            "key": AppConstant.RAZOR_PAY.RAZOR_API_KEY,
            "amount": data.payload.order_detail.amount,
            "currency": data.payload.order_detail.currency,
            "name": AppConstant.RAZOR_PAY.WEBSITE_NAME,
            "description": AppConstant.RAZOR_PAY.WEBSITE_DESCRIPTION,
            "image": AppConstant.RAZOR_PAY.WEBSITE_LOGO,
            "order_id": data.payload.order_detail.order_id,
            "handler": function (response: any) {
                let tnxPayload = {
                    payment_id: response.razorpay_payment_id,
                    order_id: response.razorpay_order_id,
                    signature: response.razorpay_signature
                }
                me._planService.storeSubscriptionResponse(tnxPayload).subscribe(result => {
                    me._notifyService.showSuccess(result.message,'')

                    if (result.success) {
                        this.msg = result.message
                        // Navigate to Brand Dashboard
                        // location.href = '/dashboard';
                        setTimeout(() => {
                            me._notifyService.showSuccess(result.message,'')
                            
                        }, 5000);
                        me._route.navigate(['/dashboard'])

                    }
                    

                });
            },
            "prefill": {
                "name": me.userDetails.fullname,
                "email": me.userDetails.email,
                "contact": me.userDetails.phone
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
                    // me._notifyService.showSuccess(this.msg,'')
        
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
