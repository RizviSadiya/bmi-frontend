import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { Campaign } from 'app/modules/admin/apps/campaigns/campaigns.types';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash-es';

import { CampaignResourcePreviewComponent } from 'app/modules/admin/apps/orders/campaign-resource-preview/campaign-resource-preview.component';
import { CampaignResourceDocumentComponent } from 'app/modules/admin/apps/orders/campaign-resource-document/campaign-resource-document.component';
import { UploadVideoComponent } from 'app/modules/admin/apps/orders/upload-video/upload-video.component';
import { ReviewVideoComponent } from 'app/modules/admin/apps/orders/review-video/review-video.component';
import { BmiConfirmationService } from '@bmi/services/confirmation';
import { CampaignsService } from 'app/modules/admin/apps/campaigns/campaigns.service';
import { OrdersService } from 'app/modules/admin/apps/orders/orders.service';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'order-progress-bar',
    templateUrl: './order-progress-bar.component.html',
    styleUrls: ['./order-progress-bar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderProgressBarComponent implements OnInit, OnDestroy {
    priceForm: FormGroup;
    removeproposalForm: FormGroup;
    currency: string;
    @Input() order: any;
    @Input() userType: string;
    @Input() orderStatus: any;
    orderStage: number;

    constructor(
        private _matDialog: MatDialog,
        private _campaignService: CampaignsService,
        private _bmiConfirmationService: BmiConfirmationService,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private orderservice:OrdersService,
        private toaster:ToastrService
    ) {}

    ngOnInit(): void {
        console.log(this.orderStatus);
        console.log("order",this.order);
        
      
        this.orderStage = (+this.orderStatus.stage < 4 && this.orderStatus.action_taken === 'Approved')
            ? +this.orderStatus.stage : +this.orderStatus.stage - 1;

            // if(this.orderStatus[0].job_description === null && this.orderStatus[0].template_script===null){
            //     this.onSubmitCampaignResourceClick()
            // }
    }

    onReviewCampaignResourceClick() {
        const reviewCampaign = this._matDialog.open(CampaignResourcePreviewComponent, {
            maxHeight: '100vh',
            autoFocus: false,
            data: {
                order: cloneDeep(this.order)
            }
        });

        reviewCampaign.afterClosed().subscribe(result => {
            if (result && result.order_id === this.order.id) {
                this.order = result;
                this.orderStatus = result;
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    onSubmitCampaignResourceClick() {
        const resourceDocument = this._matDialog.open(CampaignResourceDocumentComponent, {
            maxHeight: '100vh',

            autoFocus: false,
            data: {
                order: cloneDeep(this.order),
                type:"live_order"
            }
        });

        resourceDocument.afterClosed().subscribe(result => {
            if (result && result.order_id === this.order.id) {
                this.order = result;
                this.orderStatus = result;
                this._changeDetectorRef.markForCheck();
            }
        });
    }
script:any
    onUploadScriptClick(headerTxt: string) {
        const uploadScript = this._matDialog.open(UploadVideoComponent, {
            autoFocus: false,
            data: {
                headerText: headerTxt,
                order: cloneDeep(this.order)
            }
        });

        uploadScript.afterClosed().subscribe(result => {
            if (result && result.order_id === this.order.id) {
                this.order = result;
                this.orderStatus = result;
                console.log("result",result);
              
                this._changeDetectorRef.markForCheck();
                // window.location.reload();
            }
        });
    }

    onReviewVideoScriptClick(headerTxt: string) {
        const reviewVideoScript = this._matDialog.open(ReviewVideoComponent, {
            autoFocus: false,
            data: {
                headerText: headerTxt,
                order: cloneDeep(this.order),
            }
        });

        reviewVideoScript.afterClosed().subscribe(result => {
            if (result && result.order_id === this.order.id) {
                this.order = result;
                this.orderStatus = result;
                this._changeDetectorRef.markForCheck();

            }
        });
    }

    onviewlivevideo(){
      //  window.location.href="http://"+this.order.live_video;
        (window as any).open(this.order.live_video, "_blank");
        // (window as any).open("https://"+this.order.live_video, "_blank");
    }

    onviewprevideo(){
       // window.location.href="http://"+this.order.video_preview;
        (window as any).open("http://"+this.order.video_preview, "_blank");
    }

    markAsApproved(){
        this.removeproposalForm = this._formBuilder.group({
            title: 'accept Script',
            message: "Do you confirm that you have received the script and given approval already?",
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

        let payload = {
            order_id: this.order.id,
            action_taken: 'Approved',
            // comment: this.reviewForm.value.comment,
            stage: this.order.stage
          };
          console.log('payload',payload)
        // Open the dialog and save the reference of it
        const dialogRef = this._bmiConfirmationService.open(this.removeproposalForm.value);

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result === "confirmed") {
            console.log("this.order",this.order)
                this.orderservice.orderProcess(payload).subscribe(res=>{
                    if(res.code==200){
                       this.toaster.success(res.message)
                    //   window.location.reload()
                  
                    }
                    else{
                      this.toaster.error(res.message)
                    }
                })
            }
        });

    }

    ngOnDestroy(): void {

    }
}