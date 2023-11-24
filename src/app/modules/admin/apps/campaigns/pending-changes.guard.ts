import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { FormBuilder, FormGroup } from '@angular/forms';
import { BmiConfirmationService } from '@bmi/services/confirmation';
import { CampaignsService } from 'app/modules/admin/apps/campaigns/campaigns.service';
import { CampaignsPostComponent } from './post/post.component';

export interface ComponentCanDeactivate {
    canDeactivate: () => boolean | Observable<boolean>;
}

export interface IDeactivateComponent {
    canExit: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {

    changeConfirmationForm: FormGroup;

    constructor(
        private _formBuilder: FormBuilder,
        private _bmiConfirmationService: BmiConfirmationService,
        private _campaignsService: CampaignsService
    ) { }

    // canDeactivate(component: ComponentCanDeactivate,
    //     route: ActivatedRouteSnapshot,
    //     state: RouterStateSnapshot,
    //     nextState: RouterStateSnapshot): boolean | Observable<boolean> {
    //     // if there are no pending changes, just allow deactivation; else confirm first
        
    //  let url: string = nextState.url;
    //  console.log('Url: '+ nextState.url);
    //  this._campaignsService.setNextRouteSelectedBeforeSave(nextState.url);
    //     return component.canDeactivate() ? true :
    //     // return component.canDeactivate() ? true :
    //         this.openConfirmDialog();
    // }


    canDeactivate(component:CampaignsPostComponent,
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot,
        nextState: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean {

// return component.canExit();
let url: string = nextState.url;
//  console.log('Url: '+ nextState.url);
 this._campaignsService.setNextRouteSelectedBeforeSave(nextState.url);
return component?.canExit ? component?.canExit() : true;

}

    openConfirmDialog() {
        let returnValue = true;
        // let returnValue = false;Press Save to DRAFT your changes to edit it later
        this.changeConfirmationForm = this._formBuilder.group({
            title: 'Save your changes',
            message: 'WARNING: You have unsaved changes to this campaign, do you want to save them?',
            // message: 'WARNING: You have unsaved changes. are you sure leave this page without save?.',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:exclamation',
                color: 'warn'
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Save',
                    color: 'warn'
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Cancel',
                })
            }),
            dismissible: false
        });

        // Open the dialog and save the reference of it
        const dialogRef = this._bmiConfirmationService.open(this.changeConfirmationForm.value);
        // console.log(dialogRef.beforeClosed().pipe().);
        dialogRef.afterClosed().subscribe((result) => {
            console.log('check result',result);
            if (result === "confirmed") {
                returnValue = false;
                this._campaignsService.setSaveButtonClicked$(true);

            } 
            else {
                returnValue = true;
                this._campaignsService.setSaveButtonClicked$(false);
            }
        });
        console.log("returnValue",returnValue);
        
        return returnValue;
    }
}

