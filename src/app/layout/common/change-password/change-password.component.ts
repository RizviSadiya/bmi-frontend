import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletService } from '../wallet/wallet.service';
import { NotificationService } from 'app/core/services/notification.service';
import { SettingsService } from 'app/modules/admin/pages/settings/settings.service';
import { AppConstant } from 'app/app.constants';

@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
    passwordForm: FormGroup;
    submitted: boolean = false;

    constructor(
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialogRef: MatDialogRef<ChangePasswordComponent>,
        private _walletService: WalletService,
        private _notifyService: NotificationService,
        private _settingService: SettingsService,
        @Inject(MAT_DIALOG_DATA) private _data: { amount: number },
    ) { }

    ngOnInit(): void {
        this.passwordForm = this._formBuilder.group({
            old_password: ['', [Validators.required, Validators.pattern(AppConstant.REGEX.PASSWORD_REG)]],
            new_password: ['', [Validators.required, Validators.pattern(AppConstant.REGEX.PASSWORD_REG)]],
            new_password_confirmation: ['', [Validators.required, Validators.pattern(AppConstant.REGEX.PASSWORD_REG)]]
        });
    }

    proceed(): void {
        this.submitted = true;
        if (this.passwordForm.invalid) {
            return;
        }

        this._settingService.changePassword(this.passwordForm.getRawValue()).subscribe(data => {
            if (data.success) {
                this._notifyService.showSuccess(data.message, '');
                this._matDialogRef.close(true);
            }
        });
    }

    ngOnDestroy(): void {

    }
}