import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SettingsService } from '../settings.service';
import { NotificationService } from 'app/core/services/notification.service';

@Component({
    selector: 'settings-preferences',
    templateUrl: './preferences.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPreferencesComponent implements OnInit, OnDestroy {
    notificationsForm: FormGroup;
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
                console.log(this.userProfile);
                
                this._changeDetectorRef.markForCheck();
            });

        // Create the form
        this.notificationsForm = this._formBuilder.group({
            detail_in_exchange: [this.userProfile.detail_in_exchange, Validators.required],
            whats_app_notification: [this.userProfile.whats_app_notification, Validators.required]
        });
    }

    updateSettings() {
        this.submitted = true;
        if (this.notificationsForm.invalid) {
            return;
        }

        let payload = {
            detail_in_exchange: this.notificationsForm.value.detail_in_exchange ? 1 : 0,
            whats_app_notification: this.notificationsForm.value.whats_app_notification ? 1 : 0
        };

        this._settingService.updateSettings(payload).subscribe(data => {
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
