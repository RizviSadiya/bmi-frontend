import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { SettingsService } from '../settings.service';
import { NotificationService } from 'app/core/services/notification.service';
import { ChangePasswordComponent } from 'app/layout/common/change-password/change-password.component';

@Component({
    selector       : 'settings-account',
    templateUrl    : './account.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsAccountComponent implements OnInit, OnDestroy
{
    accountForm: FormGroup;
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
        private _matDialog: MatDialog,
        private _notifyService: NotificationService
    )
    {
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

        // Create the form
        this.accountForm = this._formBuilder.group({
            email    : [this.userProfile.email, [Validators.required, Validators.email]],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    changePassword(){
        this._matDialog.open(ChangePasswordComponent, {
            autoFocus: false,
            data: {
                amount: 0
            }
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
            }
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
