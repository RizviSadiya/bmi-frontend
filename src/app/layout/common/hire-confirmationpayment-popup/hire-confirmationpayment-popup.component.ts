import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'app/core/services/notification.service';
import { CampaignsService } from 'app/modules/admin/apps/campaigns/campaigns.service';
import { AddMoneyPopupComponent } from 'app/layout/common/add-money-popup/add-money-popup.component';
import { WalletService } from '../wallet/wallet.service';
import { UserService } from 'app/core/user/user.service';
import { atLeastOne } from 'app/core/validators/at-least-one.directive';
import { Router } from '@angular/router';
import { BmiConfirmationService } from '@bmi/services/confirmation';
@Component({
    selector: 'hire-confirmation-popup',
    templateUrl: './hire-confirmation-popup.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HireConfirmationPopupComponent implements OnInit, OnDestroy {
    documentForm: FormGroup;
    publicForm: FormGroup;
    currency: string;
    resourceData: any;
    amount: number;
    channelname:string;
    brandname:string;
    gstAmount: number;
    payableAmount: number;
    submitted: boolean = false;
    userDetails: any;
    promot_product:any;
    campname:any;
    jdCommentDescription = "Campaign Resource document\n" +
      " - Any specific instructions as to how the brand should be presented in promo time slot\n" +
      " - How brand wants his 'promotion part' to look/sound like\n" +
      " - What to speak about the brand such as list of features \n" +
      " - Any “Template script“ to refer or stick to\n" +
      " - Suggestions on the video concept/script ideas";
    amountDivider: number = 1;
    userPlan: any;
    userDetailscurrency: any;

    constructor(
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialogRef: MatDialogRef<HireConfirmationPopupComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: { response: any },
        private _notifyService: NotificationService,
        private _campaignsService: CampaignsService,
        private _matDialog: MatDialog,
        private _userService: UserService,
        private _walletService: WalletService,
        private route:Router,
        private _bmiConfirmationService: BmiConfirmationService,

    ) { }

    ngOnInit(): void {
        console.log("data",this._data);
        let channel =this._campaignsService.getHirechannelData()
        let Application =this._campaignsService.getHireapplicationData()
        let campdata =this._campaignsService.getHirecampaignData();

       // console.log("channel",channel);
       console.log("campdata",campdata);
        
        this.userPlan = this._userService.userDetails.plan_id;
       console.log("userPlan",this.userPlan)
        this._walletService.setAmountPaid$(false);
        console.log(" this._walletService.setAmountPaid$(false);", this._walletService.setAmountPaid$(false));
        
        this.userDetails = this._userService.userDetails;
        this.userDetailscurrency = this.userDetails.currency;
        console.log("userDetailscurrency.currency",this.userDetailscurrency)

        this.resourceData = this._data.response;
        console.log("resourceData",this.resourceData);
        
        this.amount = this.resourceData.campaign_budget;
        this.channelname = channel.title;
        this.brandname = campdata.brand_name;
        this.campname = campdata.camp_title;
        this.promot_product = campdata.promot_product
        //this.channel = this.channel;
        this.gstAmount = (this.amount * this.resourceData.gst) / 100;
        this.payableAmount = this.amount + this.gstAmount;
        this.documentForm = this._formBuilder.group({
            instruction: [''],
            template_script: [''],
            suggestions: [''],
            payment_term: ['0'],
            gst_invoice: []
        },
         { validator: atLeastOne('instruction','template_script') }
         );


    }
    _script:any
    instruct:any
    onFileSelected(files: FileList) {
        console.log(files);
        if (files) {
            var fileType = files[0].type;
            console.log(fileType);
            if (fileType.toLowerCase() == 'application/pdf' || fileType.toLowerCase().includes('document')) {
                this.documentForm.patchValue({
                    template_script: files[0]
                });
                this._script=files[0]
                console.log("_script",this._script);
                
            }
        }
    }


    ngOnDestroy(): void {

    }
}