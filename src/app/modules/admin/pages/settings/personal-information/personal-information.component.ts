import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SettingsService } from '../settings.service';
import { NotificationService } from 'app/core/services/notification.service';
import { AppConstant } from 'app/app.constants';


@Component({
    selector: 'settings-personal-information',
    templateUrl: './personal-information.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPersonalInformationComponent implements OnInit, OnDestroy {
    securityForm: FormGroup;
    userProfile: any;
    submitted: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _settingService: SettingsService,
        private _notifyService: NotificationService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._settingService.profile$.pipe(takeUntil(this._unsubscribeAll))
        .subscribe((user: any) => {
            this.userProfile = user;
            console.log("userprofile",this.userProfile)
            this._changeDetectorRef.markForCheck();
        });
        let phone
        if(this.userProfile.userType==='influencer'){
             phone=this.userProfile.phone
        }else{
          phone=this.userProfile.whats_app

        }

        // Create the form
        this.securityForm = this._formBuilder.group({
            fullname: [this.userProfile.fullname, Validators.required],
            skype: [this.userProfile.skype],
            phone: [phone, [Validators.required, Validators.pattern(AppConstant.REGEX.MOBILE_REG)]],
        });
    }

    updateSettings() {
        this.submitted = true;
        if (this.securityForm.invalid) {
            return;
        }

        this._settingService.updateSettings(this.securityForm.getRawValue()).subscribe(data => {
            if (data.success) {
                this.submitted = false;
                let abc = JSON.parse(localStorage.getItem('userDetails'))
                abc.fullname = this.securityForm.get('fullname').value
                localStorage.setItem('userDetails',JSON.stringify(abc))
                this._notifyService.showSuccess(data.message, '');
                localStorage.setItem('userName',JSON.stringify(this.securityForm.getRawValue().fullname))
            }
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
