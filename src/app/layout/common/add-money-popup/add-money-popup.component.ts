import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { Channel } from 'app/layout/common/channel/all-channels.types';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletService } from '../wallet/wallet.service';
import { NotificationService } from 'app/core/services/notification.service';
import { UserService } from 'app/core/user/user.service';
import { WalletHistoryService } from 'app/modules/admin/apps/wallet/history/history.service';
import { AppConstant } from 'app/app.constants';

declare var Razorpay: any;

@Component({
    selector: 'add-money-popup',
    templateUrl: './add-money-popup.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddMoneyPopupComponent implements OnInit, OnDestroy {
    amountForm: FormGroup;
    amountFromParent: number;
    submitted: boolean = false;
    fromScreen: string = "";
    minAmount = 5000;
user_currency:any
    constructor( 
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialogRef: MatDialogRef<AddMoneyPopupComponent>,
        private _walletService: WalletService,
        private _notifyService: NotificationService,
        private _userService: UserService,
        private _walletHistoryService: WalletHistoryService,
        @Inject(MAT_DIALOG_DATA) private _data: { amount: number, page: string,internal_order_id:number },
    ) { }

    ngOnInit(): void {
        console.log("data",this._data);
        this.user_currency= this._userService.userDetails
        this.amountFromParent = this._data.amount;
        this.fromScreen = this._data.page;
        this.amountForm = this._formBuilder.group({
            amount: ['', [Validators.required,
            Validators.pattern(/^[0-9]+(\.?[0-9]+)?$/)]],
            currency: [this.user_currency.currency, Validators.required]
        });

        if (this.amountFromParent > 0) {
            // this.proceed();
        }
this.gstPer = JSON.parse(sessionStorage.getItem('website'))
      
        
    }
    totalAmount
gstAmount
gstPer
    inputVlaue(event){
        console.log("value",event.target.value);
        this.gstAmount= event.target.value*18/100 
        console.log("gstAmount",this.gstAmount);
        this.totalAmount= Number(this.gstAmount)+ Number(this.amountForm.get('amount').value)
        console.log("totalAmount",this.totalAmount);

    }

    closepopup(){
        this.amountForm.reset();
        console.log("amountForm",this.amountForm.value);
        
    }

    proceed(): void {
        this.submitted = true;
        if (this.amountForm.invalid) {
            return;
        }
        if(this.amountForm.get('currency').value ==="USD"){
            console.log("this.amountForm",this.amountForm.value)
        }
        else if(this.amountForm.get('currency').value==="INR"&& this.amountForm.get('amount').value < 5000){
          
            console.log("this.amountForm",this.amountForm.value)
            this._notifyService.showError(" Minimum amount should be 5000 ", "error")
            return
        }
       if(this._data.internal_order_id){
        let obj={
            "amount":this._data.amount,
            "internal_order_id":this._data.internal_order_id,
        }
        this._walletService.payOrderAmount(obj).subscribe(res=>{
            if(res.success){
                this._matDialogRef.close(true);
            }
        })
        console.log("obj",obj);
        
       }
       else{
        let payload = {
            amount: +this.amountForm.value.amount,
            currency: this.amountForm.value.currency
        }
        this._walletService.addEwalletMoney(payload).subscribe(data => {
            if (data.success) {
                this._matDialogRef.close(true);
                let me = this;
                let options = {
                    "key": AppConstant.RAZOR_PAY.RAZOR_API_KEY,
                    "amount": data.payload.order.amount,
                    "currency": data.payload.order.currency,
                    "name": AppConstant.RAZOR_PAY.WEBSITE_NAME,
                    "description": AppConstant.RAZOR_PAY.WEBSITE_DESCRIPTION,
                    "image": AppConstant.RAZOR_PAY.WEBSITE_LOGO,
                    "order_id": data.payload.order.order_id,
                    "handler": function (response) {
                        me.handlePaymentGatewayResponse(response);
                    },
                    "prefill": {
                        "name": data.payload.profile.name,
                        "email": data.payload.profile.email,
                        "contact": data.payload.profile.contact
                    },
                    "notes": {
                        "address": "note value"
                    },
                    "theme": {
                        "color": AppConstant.RAZOR_PAY.THEME_COLOR
                    },
                    // 'modal': {
                    //     ondismiss: function() {
                    //         me._matDialogRef.close();
                    //         me._changeDetectorRef.markForCheck();
                    //     }
                    // }
                };
                let rzp1 = new Razorpay(options);
                rzp1.open();
            }
        });
       }
       
    }

    handlePaymentGatewayResponse(response) {
        let me = this;
        let tnxPayload = {
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature
        }
        
        me._walletService.storeTransactionDetails(tnxPayload).subscribe(result => {
            if (result.success) {
                me._notifyService.showSuccess(result.message, "");
                me._notifyService.showSuccess("payment Done Successfully", "");
                let newAmount = result.payload.new_amount;
                // update localstorage for wallet_balance
                let currentUser = JSON.parse(localStorage.getItem("userDetails"));
                currentUser['wallet_balance'] = +newAmount;
                localStorage.setItem('userDetails', JSON.stringify(currentUser));
                me._userService.user = currentUser;
                if (me.fromScreen === 'hire' || me.fromScreen === 'reviewVideo') {
                    me._walletService.setAmountPaid$(true);
                } else {
                    // Get transaction type wallet
                    me._walletHistoryService.getWallets(1).subscribe(() => { });
                }
            }
        });
    }

    ngOnDestroy(): void {
    }
}