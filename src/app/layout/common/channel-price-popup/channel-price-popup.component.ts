import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Channel } from 'app/layout/common/channel/all-channels.types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConstant } from 'app/app.constants';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'app/core/user/user.service';
@Component({
    selector: 'channel-price-popup',
    templateUrl: './channel-price-popup.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChannelPricePopupComponent implements OnInit, OnDestroy {
    priceForm: FormGroup;
    currency: string;
    userDetails:any
    constructor(
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private toastr:ToastrService,
        private _userService: UserService,
        private _matDialogRef: MatDialogRef<ChannelPricePopupComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: { channel: Channel },
    ) { }

    ngOnInit(): void {
        console.log("data, ",this._data)
        this.userDetails = this._userService.userDetails  
        this.priceForm = this._formBuilder.group({
            amount: [this._data.channel.promotion_price, [Validators.required, Validators.pattern(AppConstant.REGEX.NUMBER_WITH_DECIMAL_REG)]],
            currency:[this.userDetails.currency ? this.userDetails.currency : "INR"]
        });
        this.currency = this.userDetails.currency ? this.userDetails.currency : "INR";
    }

    get priceControl() { return this.priceForm.controls; }

    updateChannelPrice(): void {
        console.log("this.priceForm.get('amount').value ",this.priceForm.get('amount').value)
        if (this.priceForm.invalid) { 
            return;
        } 
        if(this.priceForm.get('currency').value ==='USD'){
            // this.toastr.error("Promotion price should be 60.68$")
        console.log("this.priceForm.get('currency').value ",this.priceForm.get('currency').value)
        // this.toastr.error("Promotion price should be 62$")
       
            // return;
        }
        // else if(this.priceForm.get('amount').value < 60.68){
        //     this.toastr.error("Promotion price should be 60.68$")
        //     return;
        // }
        
        else if(this.priceForm.get('amount').value ===0){
            this.toastr.error("amount should be greater than zero")
            return;
        }
        else if(this.priceForm.get('amount').value <=4999){
            this.toastr.error("Promotion price should be 5000")
            return;
        }
       
       

      
     
        this._matDialogRef.close(this.priceForm.value);
    }

    ngOnDestroy(): void {

    }
}