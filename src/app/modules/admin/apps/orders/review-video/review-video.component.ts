import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { debounceTime, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { Order } from 'app/modules/admin/apps/orders/orders.types';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { OrdersService } from '../orders.service';
import { NotificationService } from 'app/core/services/notification.service';
import { WalletService } from 'app/layout/common/wallet/wallet.service';
import { AddMoneyPopupComponent } from 'app/layout/common/add-money-popup/add-money-popup.component';
import { BmiConfirmationService } from '@bmi/services/confirmation';
import { ReviewPaymentConfirmationComponent } from './review-payment-confirmation/review-payment-confirmation.component';
import { ToastrService } from 'ngx-toastr';
import { AppConstant } from 'app/app.constants';

declare var Razorpay: any;

@Component({
  selector: 'review-video',
  templateUrl: './review-video.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewVideoComponent implements OnInit, OnDestroy {
  reviewForm: FormGroup;
  srcResult;
  order: Order;
  headerText: string;
  actionType: string = null;
  processing: boolean = false;
  removeproposalForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _matDialogRef: MatDialogRef<ReviewVideoComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: { order: Order, headerText: string },
    private _matDialog: MatDialog,
    private _orderService: OrdersService,
    private _notifyService: NotificationService,
    private _walletService: WalletService,
    public dialog: MatDialog,
    public toaster: ToastrService,
    private _bmiConfirmationService: BmiConfirmationService,
  ) { }
  userDetail:any
  reviewScript:any
  video_script_desc:any
  submitted: boolean = false;
  ngOnInit(): void {
    console.log("result",this._data);
    
    this.userDetail = JSON.parse(localStorage.getItem('userDetails'))
    this._walletService.setAmountPaid$(false);
    this.actionType = null;
    this.order = this._data.order;
  // if(this.order?.video_script_desc===null){
  //   this.video_script_desc ="'null'"
  //   console.log("video_script_desc",this.video_script_desc);
    
  // }
    console.log(this.order);
    this.headerText = this._data.headerText;
    this.reviewForm = this._formBuilder.group({
      comment: ["",[Validators.required]],
      promo_text_link: ["",[Validators.required]],
    });

    this._walletService.amountPaid$.subscribe(data => {
      if (data) {
        this.payRemainingAmount();
      }
    })
  }

  paywalletPayment(){
    
  //   this.removeproposalForm = this._formBuilder.group({
  //     title: 'payment from wallet',
  //     message: 'Are you sure you want to pay from wallet?',
  //     icon: this._formBuilder.group({
  //         show: true,
  //         name: 'heroicons_outline:exclamation',
  //         color: 'warn'
  //     }),
  //     actions: this._formBuilder.group({
  //         confirm: this._formBuilder.group({
  //             show: true,
  //             label: 'Yes',
  //             color: 'warn'
  //         }),
  //         cancel: this._formBuilder.group({
  //             show: true,
  //             label: 'Cancel'
  //         })
  //     }),
  //     dismissible: true
  // });

  // Open the dialog and save the reference of it
  // const dialogRef = this._bmiConfirmationService.open(this.removeproposalForm.value);

  // Subscribe to afterClosed from the dialog reference
  // dialogRef.afterClosed().subscribe((result) => {
  //     if (result === "confirmed") {
          this.processing = true;
        let payload = {
          order_id: this._data.order.id,
          action_taken: 'Approved',
          comment: this.reviewForm.value.comment,
          stage: this._data.order.stage
        };
        this.actionType = "APPROVE";
    
        this._orderService.orderProcess(payload).subscribe(
          data => {
            if (data.success) {
              this._notifyService.showSuccess(data.message, "");
              this.processing = false;
              this._matDialogRef.close(data.payload);
            }
          },
          error => {
            // error code 411 returned from server
            this.payRemainingAmount();
            // alert("your wallet amount ")
          });
      // }
  // });
   

  }

  closeModel(){
    this._matDialogRef.close();
  }

payUpiPayment(){
  console.log("payableAmount",this.order.pay_amount);
 
  let obj={
    "amount":this.order.pay_amount,
    "internal_order_id":this.order.id,
}
this._walletService.payOrderAmount(obj).subscribe(res=>{
    if(res.success){
      let me = this;
      let options = {
          "key": AppConstant.RAZOR_PAY.RAZOR_API_KEY,
          "amount": res.payload.order.amount,
          "currency": res.payload.order.currency,
          "name": AppConstant.RAZOR_PAY.WEBSITE_NAME,
          "description": AppConstant.RAZOR_PAY.WEBSITE_DESCRIPTION,
          "image": AppConstant.RAZOR_PAY.WEBSITE_LOGO,
          "order_id": res.payload.order.order_id,
          "handler": function (response) {
              me.handlePaymentGatewayResponse(response);
          },
          "prefill": {
              "name": res.payload.profile.name,
              "email": res.payload.profile.email,
              "contact": res.payload.profile.contact
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


handlePaymentGatewayResponse(response) {
  let me = this;
  let tnxPayload = {
      payment_id: response.razorpay_payment_id,
      order_id: response.razorpay_order_id,
      signature: response.razorpay_signature
  }
  me._walletService.saveOrderTransaction(tnxPayload).subscribe(result => {
      if (result.success) {
          me._notifyService.showSuccess(result.message, "");
          let payload = {
            order_id: this._data.order.id,
            action_taken: 'Approved',
            comment: this.reviewForm.value.comment,
            stage: this._data.order.stage
          };
          this.actionType = "APPROVE";
      
          this._orderService.orderProcess(payload).subscribe(
            data => {
              if (data.success) {
                this._notifyService.showSuccess(data.message, "");
                this.processing = false;
                this._matDialogRef.close(data.payload);
              }
            },
            error => {
              // error code 411 returned from server
              // this.payRemainingAmount();
              this.toaster.error(error.message)
            });
      }
  });
}

errorShow:any=1
  approve(): void { 
    this.submitted = true;
    console.log("_data",this._data);
    
    if(this._data.order.stage===3){
      this.errorShow=1
      if(this.reviewForm.invalid){
        this._notifyService.showError("please fill both flied", "error")
      return
    }
    }
   
    this.processing = true;
    let payload = {
      order_id: this._data.order.id,
      action_taken: 'Approved',
      comment: this.reviewForm.value.comment,
      promo_text_link: this.reviewForm.value.promo_text_link,
      stage: this._data.order.stage
    };
    this.actionType = "APPROVE";

    this._orderService.orderProcess(payload).subscribe(
      data => {
        if (data.success) {
          this._notifyService.showSuccess(data.message, "");
          this.processing = false;
          this._matDialogRef.close(data.payload);
        }
      },
      error => {
        // error code 411 returned from server
        // this.payRemainingAmount();
        this._notifyService.showError(error.message, "")
      });
  }

  requestChange(): void {
    if(this._data.order.stage===3){
    this.errorShow=0
    }
    this.processing = true;
    let payload = {
      order_id: this._data.order.id,
      action_taken: 'RequestChange',
      comment: this.reviewForm.value.comment,
      promo_text_link: this.reviewForm.value.promo_text_link,
      stage: this._data.order.stage
    };
    this.actionType = "CHANGE";

    this._orderService.orderProcess(payload).subscribe(
      data => {
        if (data.success) {
          this._notifyService.showSuccess(data.message, "");
          this.processing = false;
          this._matDialogRef.close(data.payload);
        }
      },
      error => {
        // error code 411 returned from server
        // this.payRemainingAmount();
        // this._notifyService.showError(error.message, "error")
      });
  }

  OpenModal(){
    const dialogRef = this.dialog.open(ReviewPaymentConfirmationComponent, {
      width: '350px',
      data:{
       data: this._data,
       Comment:this.reviewForm.value.comment
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }

  onNoClick(){}

  payRemainingAmount() {
    let payload = {
      order_id: this._data.order.id
    };

    this._orderService.payRemainingOrderAmount(payload).subscribe(
      data => {
        if (data.success) {
          switch (this.actionType) {
            case 'APPROVE':
              this.approve();
              break;
            case 'CHANGE':
              this.requestChange();
              break;
            default:
              console.log("Action type not matched...!");
          }
        }
      },
      error => {
        // error code 411 returned from server
        // this.addMoney(error.payload.remainingAmount);
        // console.log("error.payload.remainingAmount",error.payload.remainingAmount)
        this.toaster.error(error.message)
        this.addMoney(error.payload.remainingAmount);
      });
  }

  addMoney(payableAmount) {
    this._matDialog.open(AddMoneyPopupComponent, {
      autoFocus: false,
      data: {
        amount: payableAmount,
        page: "reviewVideo"
      }
    });
  }

  ngOnDestroy(): void {

  }
}



