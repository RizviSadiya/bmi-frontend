import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SettingsService } from '../settings.service';
import { NotificationService } from 'app/core/services/notification.service';
import { AppConstant } from 'app/app.constants';
import { DashboardService } from 'app/modules/admin/dashboard/dashboard.service';

@Component({
    selector: 'settings-billing',
    templateUrl: './billing.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsBillingComponent implements OnInit, OnDestroy {
    accountForm: FormGroup;
    userProfile: any;
    userName: any;
    countries: any;
    submitted: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();


    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _settingService: SettingsService,
        private _notifyService: NotificationService,
        private _dashboardService:DashboardService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    gstNo: string
    ngOnInit(): void {
        this._dashboardService.getDashboardData().subscribe(res=>{
            if(res.success){
                this.userProfile =res.payload
                console.log("userProfile",this.userProfile);
                
            }
               else{
        let userName= JSON.parse(localStorage.getItem('userDetails'));
       let name= userName?.fullname?.split(' ')
       this.userProfile.fullname = name[0]
       }
        })
        this._settingService.profile$.pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: any) => {
                this.userProfile = user;
                // this.userProfile.fullname = JSON.parse(localStorage.getItem('userName'));
                this._changeDetectorRef.markForCheck();
            });

        this._settingService.getCountryList().subscribe(data => {
            this.countries = data.payload;
            this._changeDetectorRef.markForCheck();
        });

        // Create the form
        this.accountForm = this._formBuilder.group({
            fullname: [this.userProfile.fullname,[Validators.required]],
            whats_app: [this.userProfile.whats_app,[Validators.required]],
            skype: [this.userProfile.skype,[Validators.required]],
            pan_no: [this.userProfile.pan_no,[Validators.required]],
            company_name: [this.userProfile.company_name,[Validators.required]],
            company_address: [this.userProfile.company_address,[Validators.required]],
            gst: [this.userProfile.gst,[Validators.required]],
            country_id: [this.userProfile.country_id ? this.userProfile.country_id : 103,[Validators.required]],
            // currency: [this.userProfile.currency,[Validators.required]]
        });
        // this.accountForm = this._formBuilder.group({
        //     fullname: [this.userProfile.fullname, [Validators.required, Validators.pattern(AppConstant.REGEX.NAME_REG)]],
        //     whats_app: [this.userProfile.whats_app, [Validators.required, Validators.pattern(AppConstant.REGEX.MOBILE_REG)]],
        //     skype: [this.userProfile.skype, [Validators.required, Validators.pattern(AppConstant.REGEX.SKYPE_REG)]],
        //     pan_no: [this.userProfile.pan_no, [Validators.required, Validators.pattern(AppConstant.REGEX.PAN_REG)]],
        //     company_name: [this.userProfile.company_name, [Validators.required, Validators.pattern(AppConstant.REGEX.NAME_REG)]],
        //     company_address: [this.userProfile.company_address, [Validators.required, Validators.pattern(AppConstant.REGEX.ADDRESS_REG)]],
        //     gst: [this.userProfile.gst, [Validators.pattern(AppConstant.REGEX.GST_REG)]],
        //     country_id: [this.userProfile.country_id ? this.userProfile.country_id : 103, [Validators.required]],
        //     currency: [this.userProfile.currency, [Validators.required]]
        // });
        // if(this.accountForm.get('gst').value.VALID){
        //     const company_name = this.accountForm.get("company_name");
        //     const company_address = this.accountForm.get("company_address");
        //     const pan_no = this.accountForm.get("pan_no");
        //     company_name.setValidators([Validators.required]);
        //     company_address.setValidators([Validators.required]);
        //     pan_no.setValidators([Validators.required]);
        //     company_name.updateValueAndValidity()
        //     company_name.updateValueAndValidity()
        //     pan_no.updateValueAndValidity()

        // }

    }

    get company_name() { return this.accountForm.get('company_name'); }
    get pan_no() { return this.accountForm.get('pan_no'); }
    get gst() { return this.accountForm.get('gst'); }
    get skype() { return this.accountForm.get('skype'); }
    get company_address() { return this.accountForm.get('company_address'); }
    get whats_app() { return this.accountForm.get('whats_app'); }
    get fullname() { return this.accountForm.get('fullname'); }

    updateSettings() {
        this.submitted = true;
        // if (this.accountForm.invalid) {
        //     console.log("accountForm", this.accountForm.value)
        //     return;
        // } 
        console.log("accountForm", this.accountForm.value);

        if (this.accountForm.value.gst != "") {
            // this._notifyService.showError("please fill PAN Number", 'error')
            if(this.accountForm.value.pan_no==''){
            // this._notifyService.showError("please fill PAN Number", 'error')
            }
            if(this.accountForm.value.company_name ==''){
                // this._notifyService.showError("please fill Company Name", 'error')
            }
            if(this.accountForm.value.company_address ==''){
            // this._notifyService.showError("please fill Company Address",'error')
            }
        } 
        this._settingService.updateSettings(this.accountForm.getRawValue()).subscribe(data => {
            if (data.success) {
                this.submitted = false;
                localStorage.setItem('userDetails',JSON.stringify(data.payload))
                this._notifyService.showSuccess(data.message, '');
            }
        }); 
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
