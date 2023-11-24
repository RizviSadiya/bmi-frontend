import { Component, OnInit,Inject } from '@angular/core';
import { FormGroup,FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { BmiConfirmationService } from '@bmi/services/confirmation';
import { NotificationService } from 'app/core/services/notification.service';
import { AddMoneyPopupComponent } from 'app/layout/common/add-money-popup/add-money-popup.component';
import { OrdersService } from '../../orders.service';
import { Order } from '../../orders.types';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-review-payment-confirmation',
  templateUrl: './review-payment-confirmation.component.html',
  styleUrls: ['./review-payment-confirmation.component.scss']
})
export class ReviewPaymentConfirmationComponent implements OnInit {
  processing: boolean = false;
  reviewForm: FormGroup;
  actionType: string = null;
  removeproposalForm: any;
  constructor(
    private _matDialogRef: MatDialogRef<ReviewPaymentConfirmationComponent>,
    private _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private toaster:ToastrService,
    private _bmiConfirmationService: BmiConfirmationService,
    @Inject(MAT_DIALOG_DATA) private _data: { data:Data,order: Order ,headerText: string ,Comment:string},
    private _orderService: OrdersService,
    private _notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
  }

  paywalletPayment(){

    this.removeproposalForm = this._formBuilder.group({
      title: 'payment from wallet',
      message: 'Are you sure you want to pay from wallet?',
      icon: this._formBuilder.group({
          show: true,
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
  const dialogRef = this._bmiConfirmationService.open(this.removeproposalForm.value);

  // Subscribe to afterClosed from the dialog reference
  dialogRef.afterClosed().subscribe((result) => {
      if (result === "confirmed") {
      
        console.log("_data.data.order",this._data.data.order);
        console.log("_data",this._data);
        console.log("_data.data",this._data.data);
        console.log("_data.Comment",this._data.Comment);
        
      
        this.processing = true;
        let payload = {
          order_id: this._data.data.order.id,
          action_taken: 'Approved',
          comment: this._data.Comment,
          stage: this._data.data.order.stage
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
      }
  });
   
    
    }

    payRemainingAmount() {
      let payload = {
        order_id:this._data.data.order.id
      };
  
      this._orderService.payRemainingOrderAmount(payload).subscribe(
        data => {
          if (data.success) {
            switch (this.actionType) {
              case 'APPROVE':
                this.paywalletPayment();
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
          // alert(error.message)
          this.toaster.error(error.message)
          // this.payUpiPayment(error.payload.remainingAmount);
          // console.log("error.payload.remainingAmount",error.payload.remainingAmount)
        });
    }

    requestChange(): void {
      this.processing = true;
      let payload = {
        order_id: this._data.order.id,
        action_taken: 'RequestChange',
        comment: this.reviewForm.value.comment,
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
          this.payRemainingAmount();
        });
    }
  

    payUpiPayment(payableAmount){
   const dialogRef= this._matDialog.open(AddMoneyPopupComponent, {
      autoFocus: false,
      data: {
        amount: payableAmount,
        page: "reviewVideo"
      }
    }); 
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      window.location.reload();
    });
    
  }

  cancel(){
  this._matDialogRef.close(false)
    
  }

}
