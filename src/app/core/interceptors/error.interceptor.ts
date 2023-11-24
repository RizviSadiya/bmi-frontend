import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationService } from '../services/notification.service';
import { BmiConfirmationService } from '@bmi/services/confirmation';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    publicForm:FormGroup
    constructor(
        private _bmiConfirmationService: BmiConfirmationService,
        private notifyService : NotificationService,
        private _formBuilder : FormBuilder,
        private _router : Router,
    ) { }

    CampLivenotification(){
        // if(this.userPlan===1){
            this.publicForm = this._formBuilder.group({
                title: 'Upgrade Plan',
                message: '  You Need to Upgrade to Starter or Business plan for creating more  then 1 Live campaign. ',
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
                
                    // this._campaignService.DeleteProposal(this.application.id).subscribe(res=>{
                    //     if(res.code==200){
                    //        this.toaster.success(res.message)
                    //         this.getList.emit()
                    //         window.location.reload()
                    //     console.log("this.getList",this.getList.emit())
                    //     }
                    //     else{
                    //       this.toaster.error(res.message)
                    //     }
                    // })
                    this._router.navigate(['/choose-plan'])
                   
                
                }
            });
           
        // }
        // if(this.userPlan===1){
        //     this._notifyService.showError("we should prompt user to upgrade as this feature is only for paid plans.","Error")
        //     this.campaignForm.get('step2').get('visibility').setValue(this.userPlan)
        // }
        // console.log("planId",this.campaignForm.get('step2').get('visibility').value,)
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                localStorage.clear();
                // location.reload();
                this.notifyService.showError(err.error.message, "Error");

            }

            if (err.status === 400  || err.status === 404) {
                this.notifyService.showError(err.error.message, "Error");
            }

            if (err.status === 422) {
                
                this.notifyService.showError(err.error.message, "Warning");
                // if(err.error.message==='Please upgrade to create more than one live campaign..'){
                //     // this.CampLivenotification()
                //     this._router.navigate(['/choose-plan'])
                // return

                // }
            //   console.log("err",err.error.message);
              
            }

            if (err.status === 405) {
                this.notifyService.showError(err.error.message, "Error");
                // this.notifyService.showError("Some error occured. Please try again later.", "Error");
            }

            if (err.status === 504) {
                this.notifyService.showError(err.error.message, "Error");
                // this.notifyService.showError("Gateway Time-out. Please try later.", "Error");
            }

            if (err.status === 500) {
                this.notifyService.showError(err.error.message, "Error");
                // this.notifyService.showError("Unable to fetch data at this time.", "Error");
            }
            if (err.status === 501) {
                this.notifyService.showError(err.error.message, "Error");
                // this.notifyService.showError("Unable to fetch data at this time.", "Error");
            }

            if (err.status === 400 || err.status === 411) {
                return throwError(err.error);
            }

            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }

    upgradePopupForCampaign() {
        this.publicForm = this._formBuilder.group({
            title: 'Upgrade Plan',
            message: ' Your active plan are not allowed to create more than 2 live campaign.',
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
            
                // this._campaignService.DeleteProposal(this.application.id).subscribe(res=>{
                //     if(res.code==200){
                //        this.toaster.success(res.message)
                //         this.getList.emit()
                //         window.location.reload()
                //     console.log("this.getList",this.getList.emit())
                //     }
                //     else{
                //       this.toaster.error(res.message)
                //     }
                // })
            
                this._router.navigate(['/choose-plan'])
            }
        });
    }
}