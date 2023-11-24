import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { Order } from 'app/modules/admin/apps/orders/orders.types';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrdersService } from '../orders.service';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'order-dispute-reason',
    templateUrl: './order-dispute-reason.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDisputeReasonComponent implements OnInit, OnDestroy {
    disputeForm: FormGroup;

    constructor(
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private OrderService:OrdersService,
        private Toasterservice:ToastrService,
        private _matDialogRef: MatDialogRef<OrderDisputeReasonComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: { order: Order },
    ) { }

    ngOnInit(): void {
        console.log("data",this._data)
        this.disputeForm = this._formBuilder.group({
            reason: [this._data.order.disputeReason, Validators.required],
            order_id: [this._data.order.id, Validators.required],
        });
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

    ngOnDestroy(): void {

    }
}