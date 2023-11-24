import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConstant } from 'app/app.constants';
import { DashboardService } from 'app/modules/admin/dashboard/dashboard.service';
import { SettingsService } from 'app/modules/admin/pages/settings/settings.service';
import { NotificationsService } from "app/layout/common/notifications/notifications.service"

@Component({
    selector: 'information-review-popup',
    templateUrl: './information-review-popup.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InformationReviewPopupComponent implements OnInit, OnDestroy {
    infoForm: FormGroup;
    userDetails: any;
    editMode: boolean = false;
    submitted: boolean = false;
    countries: any;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private NotificationsService: NotificationsService,
        private _formBuilder: FormBuilder,
        private _matDialogRef: MatDialogRef<InformationReviewPopupComponent>,
        private _dashboardService: DashboardService,
        @Inject(MAT_DIALOG_DATA) private _data: { user: any },
        private _settingService: SettingsService
    ) { }

    ngOnInit(): void {
        console.log("this._data",this._data);
        
        this.userDetails = this._data.user;

        this._settingService.getCountryList().subscribe(data => {
            this.countries = data.payload;
            this._changeDetectorRef.markForCheck();
        });

        this.infoForm = this._formBuilder.group({
            fullname: [this.userDetails.fullname, [Validators.required, Validators.pattern(AppConstant.REGEX.NAME_REG)]],
            email: [this.userDetails.email, [Validators.required, Validators.email]],
            phone: [this.userDetails.phone, [Validators.required, Validators.pattern(AppConstant.REGEX.MOBILE_REG)]],
            country_id: [this.userDetails.country_id ? this.userDetails.country_id : 103, [Validators.required]],
            // channel_name: [this.userDetails?.canonical_name ? this.userDetails?.canonical_name : this.userDetails?.channel_name, [Validators.required, Validators.pattern(AppConstant.REGEX.NAME_REG)]],
            // channel_lang: [this.userDetails?.language, Validators.required],
            // currency: ['INR', Validators.required],
            // promotion_price: [this.userDetails?.video_promotion_price, [Validators.required, Validators.pattern(AppConstant.REGEX.NUMBER_WITH_DECIMAL_REG)]]
        });
    }

    editInfo() {
        this.editMode = true;
    }

    viewInfo() {
        this.editMode = false;
    }

    updateInfo(): void {
        this.submitted = true;
        if (this.infoForm.invalid) {
            return;
        }
        // this._matDialogRef.close(true);

        // this._dashboardService.updateInformation(this.infoForm.getRawValue()).subscribe(data => {
        //     if (data.success) {
        //         this._matDialogRef.close(true);
        //     }
        // });
        this.NotificationsService.updateInfo(this.infoForm.getRawValue()).subscribe(data => {
            if (data.success) {
                this._matDialogRef.close(true);
            }
        });
    }

    ngOnDestroy(): void {

    }
}