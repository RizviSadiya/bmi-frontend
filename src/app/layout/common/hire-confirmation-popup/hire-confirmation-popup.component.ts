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
import {CampaignResourceDocumentComponent} from 'app/modules/admin/apps/orders/campaign-resource-document/campaign-resource-document.component'
import { BmiConfirmationService } from '@bmi/services/confirmation';
import { AppConstant } from 'app/app.constants';

declare var Razorpay: any;

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
    channelname:any;
    brandname:string;
    gstAmount: number;
    payableAmount: number;
    submitted: boolean = false;
    userDetails: any;
    promot_product:any;
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
        this.channelname =this._campaignsService.getHirechannelData()
        let Application =this._campaignsService.getHireapplicationData()
        let campdata =this._campaignsService.getHirecampaignData();
       // console.log("channel",channel);
       console.log("campdata",campdata);
       console.log("channel",channel);
    //    this.channelname = channel.title;
    //    this.channelname = channel.name;
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
       
        this.brandname = campdata.brand_name
        this.promot_product = campdata.promot_product
        //this.channel = this.channel;
        this.gstAmount = (this.amount * this.resourceData.gst) / 100;
        this.payableAmount = this.amount + this.gstAmount;
        this.documentForm = this._formBuilder.group({
            instruction: [''],
            template_script: [''],
            suggestions: [''],
            payment_term: ['0'],
            gst_invoice: [],
            plateform_type:[campdata.plateform_type]
        },
         { validator: atLeastOne('instruction','template_script') }
         );

        this._walletService.amountPaid$.subscribe(data => {
            console.log(data);
            if (data) {
                console.log("sadiya",data);
                
                this.submitApplication();
                // this._matDialogRef.close(true);
                // this._changeDetectorRef.markForCheck();
            }
        })

        // this.donloadInvoice()

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

    onPaymentSelection() {
        console.log("this.documentForm.value.payment_term",this.documentForm.value.payment_term);
        
        if (this.documentForm.value.payment_term === "0") {
            this.amountDivider = 1;
          this.payableAmount=  this.amount + this.gstAmount;
            console.log("payableAmount",this.payableAmount);
            
            // this.payableAmount = Number(this.amount)-Number
        } else {
            this.payableAmount= Number(this.payableAmount)/2
            console.log("payableAmount",this.payableAmount);
            
            this.amountDivider = 2;
        }
    }
   
    submitApplication(): void {
        this.submitted = true;
        console.log(this.documentForm.errors)
        console.log(this.documentForm.value)
        // if (this.documentForm.invalid) {
        //     return;
        // }
        // if(this.documentForm.get("instruction").value ===undefined && this.documentForm.get("template_script").value ===undefined){
        //     this._notifyService.showError('Please fill at Least one field','Error')
        //     console.log("documentForm",this.documentForm.value);
            
        //     return
        // }


        const formData = new FormData();
        if(this.documentForm.get("instruction").value ===undefined){
            // formData.append('job_description', "");
            // alert(this.documentForm.get("instruction").value ===undefined)
        
        }else{
           
                // formData.append('job_description', this.documentForm.get('instruction').value);
            
            
        }
        formData.append('application_id', this.resourceData.application_id);
        formData.append('payment_term', this.documentForm.get('payment_term').value);
        formData.append('plateform_type', this.documentForm.get('plateform_type').value);
        // formData.append('job_description', this.documentForm.get('instruction').value);
        // formData.append('template_script', this.documentForm.get('template_script').value);
        // formData.append('suggestions', this.documentForm.get('suggestions').value);
        // formData.append('gst_invoice', this.documentForm.get('gst_invoice').value);
        console.log("formData",formData);
if(this.documentForm.get('payment_term').value !=null){
    this._campaignsService.hireChannel(formData).subscribe(
        data => {
            console.log("data",data);
           
                //this._notifyService.showSuccess(data.message, "success");
                formData.delete('application_id');
                formData.delete('payment_term');
                formData.delete('plateform_type');
                // formData.delete('job_description');
                // formData.delete('template_script');
                // formData.delete('suggestions');
                // formData.delete('gst_invoice');
                this._matDialogRef.close(true);
                this._changeDetectorRef.markForCheck();
                const procePopupDialog = this._matDialog.open(CampaignResourceDocumentComponent,{
                    autoFocus: false,
                    data: {
                        order: data.payload,
                    
                    }
                });   
                     
        },
        error => {
            // this._notifyService.showError(error.message,"error")
            this._matDialogRef.close(false);
            formData.delete('application_id');
                formData.delete('payment_term');
                // formData.delete('job_description');
                // formData.delete('template_script');
                // formData.delete('suggestions');
                // formData.delete('gst_invoice');
                // this._walletService.setAmountPaid$(false);
    
            this.addMoney(error.payload.remainingAmount);
            console.log("error.payload.remainingAmount",error.payload.remainingAmountx)
            console.log("Error while hiring...!");
            console.log(error);
           
        }
    )
}
       
    }

    invoice:any
    donloadInvoice(){
        let payload={
            'application_id':this.resourceData.application_id,
            'payment_term':this.documentForm.get('payment_term').value,
            'plateform_type':this.documentForm.get('plateform_type').value
        }
        this._campaignsService.invoice_download(payload).subscribe(res=>{
            console.log("res",res);
            this.invoice =res.payload

            console.log("invoice",this.invoice.invoice);
        window.open(this.invoice.invoice)
        })
    }

    downloadFile() {
        const apiUrl = 'https://api.example.com/download'; // Replace with your API endpoint URL
        let payload={
            'application_id':this.resourceData.application_id,
            'payment_term':this.documentForm.get('payment_term').value,
            'plateform_type':this.documentForm.get('plateform_type').value
        }
        this._campaignsService.invoice_download(payload).subscribe((response: Blob) => {
          const downloadUrl = URL.createObjectURL(response);
          console.log("response",response);
          
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'file.pdf'; // Specify the desired file name
          link.click();
          // Clean up the object URL after the download
          URL.revokeObjectURL(downloadUrl);
        }, error => {
          console.error(error);
        });
      }

    notification(){
        if(this.userPlan===1||this.userPlan===2 ){
            this.publicForm = this._formBuilder.group({
                title: 'Upgrade Plan',
                message: 'Only paid users can publish Publicly visible campaigns. Please upgrade your plan to enable this feature.?',
                icon: this._formBuilder.group({
                    show: true,
                    name: 'heroicons_outline:exclamation',
                    color: 'warn'
                }),
                actions: this._formBuilder.group({
                    confirm: this._formBuilder.group({
                        show: true,
                        label: 'Upgrade Plan',
                        color: 'success'
                    }),
                    cancel: this._formBuilder.group({
                        show: true,
                        label: 'Cancel'
                    })
                }),
                dismissible: true
            });
    
            // Open the dialog and save the reference of it
            const dialogRef = this._bmiConfirmationService.open(this.publicForm.value);
    
            // Subscribe to afterClosed from the dialog reference
            dialogRef.afterClosed().subscribe((result) => {
                if (result === "confirmed") {
                    this.route.navigate(['/choose-plan'])
                }
            });
           
        }
    }

    confirmPopUp(){
        
            this.publicForm = this._formBuilder.group({
                title: 'Wallet payment',
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
                        color: 'success'
                    }),
                    cancel: this._formBuilder.group({
                        show: true,
                        label: 'Cancel'
                    })
                }),
                dismissible: true
            });
    
            // Open the dialog and save the reference of it
            const dialogRef = this._bmiConfirmationService.open(this.publicForm.value);
    
            // Subscribe to afterClosed from the dialog reference
            dialogRef.afterClosed().subscribe((result) => {
                if (result === "confirmed") {
                this.submitApplication()
                }
            });
    }

    paymentToUpi(){
        // console.log("payableAmount",this.order.pay_amount);
       
        let obj={
        //   "amount":this.payableAmount,
        //   "internal_order_id":this.order.id,
         
          "application_id":this.resourceData.application_id,
          "payment_term":this.documentForm.get('payment_term').value,
          "plateform_type":this.documentForm.get('plateform_type').value
      }
      console.log("obj",obj);
      
      this._walletService.payHireAmount(obj).subscribe(res=>{
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
                this._matDialogRef.close(true);

        }
      });
          }
      
      
      handlePaymentGatewayResponse(response) {
        // this._matDialogRef.close(true);

        let me = this;
        let tnxPayload = {
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature
        }
        me._walletService.saveHireTransactionDetails(tnxPayload).subscribe(result => {
            if (result.success) {
                me._notifyService.showSuccess(result.message, "");
                // this._matDialogRef.close(true);
                this.resourceOrder = result.payload
                this._matDialogRef.close(true);
                this._changeDetectorRef.markForCheck();
                const procePopupDialog = this._matDialog.open(CampaignResourceDocumentComponent,{
                    autoFocus: false,
                    data: {
                        order: result.payload,
                    
                    }
                }); 
                // this.route.navigate[('/pages/orders')]
               }
            //   this.OpenCmapResourcePopUp()
               });
      }

      resourceOrder:any
      OpenCmapResourcePopUp(){
        const procePopupDialog = this._matDialog.open(CampaignResourceDocumentComponent,{
            autoFocus: false,
            data: {
                order: this.resourceOrder,
            
            }
        }); 
      }

    addMoney(payableAmount):void {
      const walletpopup=  this._matDialog.open(AddMoneyPopupComponent, {
            autoFocus: false,
            data: {
                amount: payableAmount,
                page: "hire"
            }
        });
        walletpopup.afterClosed().subscribe(result => {
                this.documentForm.reset();
        })
    }

    ngOnDestroy(): void {

    }
}