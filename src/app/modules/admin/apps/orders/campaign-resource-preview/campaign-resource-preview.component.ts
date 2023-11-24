import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { Order } from 'app/modules/admin/apps/orders/orders.types';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { atLeastOne } from 'app/core/validators/at-least-one.directive';
import { OrdersService } from '../orders.service';
import { NotificationService } from 'app/core/services/notification.service';

@Component({
  selector: 'campaign-resource-preview',
  templateUrl: './campaign-resource-preview.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampaignResourcePreviewComponent implements OnInit, OnDestroy {
  reviewForm: FormGroup;
  order: Order;
  userDetail:any
  documentForm: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _matDialogRef: MatDialogRef<CampaignResourcePreviewComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: { order: any},
    private _orderService: OrdersService,
    private _notifyService: NotificationService
  ) { }

  ngOnInit(): void {
    this.userDetail = JSON.parse(localStorage.getItem('userDetails'))

    console.log(this._data.order);
    this.order = this._data.order;
    this.reviewForm = this._formBuilder.group({
      comment: [""],
      template_script: [""],
    });

  }

//   onFileSelected(files: FileList) {
//     console.log(files);
//     if (files) {
//         var fileType = files[0].type;
//         console.log(fileType);
//         if (fileType.toLowerCase() == 'application/pdf' || fileType.toLowerCase().includes('document')) {
//             // this.reviewForm.patchValue({
//             //     template_script: files[0]
//             // });
//             console.log();
            
//         }
//     }
// }

  approve(): void {
    let payload = {
      order_id: this._data.order.id,
      action_taken: 'Approved',
      comment: this.reviewForm.value.comment,
      // file_name:this.reviewForm.value.template_script,
      stage: this._data.order.stage
    };
console.log("payload",payload)
  this._orderService.orderProcess(payload).subscribe(data => {
      console.log(data);
      if (data.success) {
        this._notifyService.showSuccess(data.message, "");
        setTimeout(() => {
          this._notifyService.showWarning(" Submit video concept/script","")
        }, 5000);
        this._matDialogRef.close(data.payload);
      }
    });
  }

  requestChange(): void {
    let payload = {
      order_id: this._data.order.id,
      action_taken: 'RequestChange',
      comment: this.reviewForm.value.comment,
      stage: this._data.order.stage
    };

    this._orderService.orderProcess(payload).subscribe(data => {
      console.log(data);
      if (data.success) {
        this._notifyService.showSuccess("Request Change successfully sent to Brand", "");
        this._matDialogRef.close(data.payload);
      }
    });
  }

  ngOnDestroy(): void {

  }
}