import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { NotificationService } from 'app/core/services/notification.service';
import { DashboardService } from 'app/modules/admin/dashboard/dashboard.service';
import { UserService } from 'app/core/user/user.service';
import { CampaignsService } from 'app/modules/admin/apps/campaigns/campaigns.service';

@Component({
    selector: 'update-category-popup',
    templateUrl: './update-category-popup.component.html',
    styleUrls: ['./update-category-popup.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateCategoryPopupComponent implements OnInit, OnDestroy {
    categoryForm: FormGroup;
    submitted: boolean = false;
    preferences: string[];
    categoriesData: any;

    constructor(
        private _formBuilder: FormBuilder,
        private _matDialogRef: MatDialogRef<UpdateCategoryPopupComponent>,
        private _dashboardService: DashboardService,
        private _notifyService: NotificationService,
        private _userService:UserService,
        private _campaignsService: CampaignsService,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private _data: { preferences: any }
    ) { }

    ngOnInit(): void {
        this.preferences = this._data.preferences ? this._data.preferences.split(",") : [];
        this.categoryForm = this._formBuilder.group({
            category: this._formBuilder.array([], [Validators.required])
        });

        this.categoryForm.setControl('category', this._formBuilder.array(this.preferences || []));

        this._campaignsService.getCategoryList().subscribe((data) => {
            if (data.success) {
                this.categoriesData = data.payload;
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    onSelectionChange(e) {
        const categories: FormArray = this.categoryForm.get('category') as FormArray;

        if (e.target.checked) {
            categories.push(new FormControl(e.target.value));
        } else {
            let i: number = 0;
            categories.controls.forEach((item: FormControl) => {
                if (item.value == e.target.value) {
                    categories.removeAt(i);
                    return;
                }
                i++;
            });
        }
    }

    proceed(nextRoute: string): void {
        this.submitted = true;
        if (this.categoryForm.invalid) {
            return;
        }

        let payload = {
            category_preferences: this.categoryForm.value.category.toString()
        }

        this._dashboardService.updateCategoryPreference(payload).subscribe(data => {
            if (data.success) {
                this._userService.updateUserDetailsInLocalStorage("category_preferences", this.categoryForm.value.category.toString());
                this._notifyService.showSuccess(data.message, "");
                this._matDialogRef.close(nextRoute);
            }
        })
    }

    checkIfValueSelected(value: string) {
        let retValue: boolean = false;
        if(this.preferences.length > 0) {
            retValue = this.preferences.includes(value);
        }
        return retValue;
    }

    ngOnDestroy(): void {

    }
}