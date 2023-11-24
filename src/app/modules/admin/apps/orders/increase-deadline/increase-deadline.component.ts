import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { Order } from 'app/modules/admin/apps/orders/orders.types';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrdersService } from '../orders.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-increase-deadline',
  templateUrl: './increase-deadline.component.html',
  styleUrls: ['./increase-deadline.component.scss']
})
export class IncreaseDeadlineComponent implements OnInit {

  constructor(
    private _formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private OrderService:OrdersService,
    private Toasterservice:ToastrService,
    private _matDialogRef: MatDialogRef<IncreaseDeadlineComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: {
        id: any; order_process: Order 
},
) { }
    disputeForm: FormGroup;
   applicationForm: FormGroup;
    ngOnInit(): void {
        console.log("data",this._data)
        this.applicationForm = this._formBuilder.group({
           
            order_id: [this._data.id, Validators.required],
            delivery_days: ['', Validators.required],
            other_delivery_days: [''],

          //   {
          //     "order_id":"11"
          //     "delivery_days":"15",
          //     "other_delivery_days":""
             
          // }
        });
    }

    deliveryDaysSelection() {
      const otherDeliveryDays = this.applicationForm.get("other_delivery_days");
      if (this.applicationForm.value.delivery_days === "other") {
          otherDeliveryDays.setValidators([Validators.required]);
      } else {
          otherDeliveryDays.setValidators(null);
      }
      otherDeliveryDays.updateValueAndValidity();
  }

    raiseDispute(): void {
        
        this.OrderService.raiseDispute(this.disputeForm.value).subscribe(res=>{
            if(res.success){
                this.Toasterservice.success(res.message)
                this._matDialogRef.close()
            }
            else{this.Toasterservice.error(res.message)}
        })
    }
    increaseOderdDat(): void {
        
        this.OrderService.deadlinIncrease(this.applicationForm.value).subscribe(res=>{
            if(res.success){
                this.Toasterservice.success(res.message)
                this._matDialogRef.close()
            }
            else{this.Toasterservice.error(res.message)}
        })
    }

    ngOnDestroy(): void {

    }
}