import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SettingsService } from '../settings.service';
import { NotificationService } from 'app/core/services/notification.service';
import { AppConstant } from 'app/app.constants';

@Component({
    selector: 'settings-payment',
    templateUrl: './payment.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPaymentComponent implements OnInit, OnDestroy {
    accountForm: FormGroup;
    userProfile: any;
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
                this._changeDetectorRef.markForCheck();
            });

        this._settingService.getCountryList().subscribe(data => {
            this.countries = data.payload;
            this._changeDetectorRef.markForCheck();
        });

        // Create the form
        this.accountForm = this._formBuilder.group({
            country_id: [this.userProfile.country_id ? this.userProfile.country_id : 103, [Validators.required]],
            upi_id: [this.userProfile.upi_id],
            account_holder: [this.userProfile.account_holder, [ Validators.pattern(AppConstant.REGEX.NAME_REG)]],
            bank_name: [this.userProfile.bank_name, [ Validators.pattern(AppConstant.REGEX.NAME_REG)]],
            account_number: [this.userProfile.account_number, [ Validators.pattern(AppConstant.REGEX.ACCOUNT_NUMBER_REG)]],
            ifsc_code: [this.userProfile.ifsc_code, [ Validators.pattern(AppConstant.REGEX.IFSC_REG)]],
            pan_no: [this.userProfile.pan_no, [Validators.pattern(AppConstant.REGEX.PAN_REG)]],
            gst_no: [this.userProfile.gst_no]
        });
    }

    updateSettings() {
        this.submitted = true;
        if (this.accountForm.invalid) {
            return;
        }

        this._settingService.updateSettings(this.accountForm.getRawValue()).subscribe(data => {
            if (data.success) {
                this.submitted = false;
                this._notifyService.showSuccess(data.message, '');
                localStorage.setItem('userDetails', JSON.stringify(data.payload));
            }
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
