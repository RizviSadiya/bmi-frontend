import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { filter, map } from 'rxjs/operators';

import { CampaignsService } from 'app/modules/admin/apps/campaigns/campaigns.service';

@Component({
    selector: 'select-category-popup',
    templateUrl: './select-category-popup.component.html',
    styleUrls: ['./select-category-popup.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectCategoryPopupComponent implements OnInit {
    categoryForm: FormGroup;
    categoriesData: any;
    selectedCategories: any;
    otherCategorySelected: boolean = false;
    otherCategory: FormControl = new FormControl();
    minLength: number = 3;

    constructor(
        private _formBuilder: FormBuilder,
        private _campaignsService: CampaignsService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialogRef: MatDialogRef<SelectCategoryPopupComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: { allCategories: any, selectedCategories: any }
    ) { }

    ngOnInit(): void {
        this.categoriesData = this._data.allCategories;
        this.selectedCategories = this._data.selectedCategories;
        this.categoryForm = this._formBuilder.group({
            category: this._formBuilder.array([], [Validators.required])
        });

        this.categoryForm.setControl('category', this._formBuilder.array(this.selectedCategories || []));

        // this._campaignsService.getCategoryList().subscribe((data) => {
        //     if (data.success) {
        //         this.categoriesData = data.payload;
        //         this._changeDetectorRef.markForCheck();
        //     }
        // });


        // this.selectedCategories.forEach(element => {
        // if (this.categoriesData.indexOf(element) < 0) {
        //     this.otherCategorySelected = true;
        //     this.otherCategory.setValue(element);
        //     this.selectedCategories.push("Other");
        // }
        // console.log(this.categoriesData.find(u => u.name === element));
        // });

        this.otherCategory.valueChanges.pipe(
            map((value) => {
                return value;
            }),
            filter(value => value && value.length >= this.minLength)
        ).subscribe((value) => {
            const categories: FormArray = this.categoryForm.get('category') as FormArray;
            let i: number = 0;
            categories.controls.forEach((item: FormControl) => {
                if (value.includes(item.value)) {
                    categories.removeAt(i);
                    return;
                }
                i++;
            });
            categories.push(new FormControl(value));
        });
    }

    onSelectionChange(e) {
        const categories: FormArray = this.categoryForm.get('category') as FormArray;

        if (e.target.checked) {
            if (e.target.value === "Other") {
                this.otherCategorySelected = true;
            } else {
                categories.push(new FormControl(e.target.value));
            }
        } else {
            let i: number = 0;
            if (e.target.value === "Other") {
                categories.controls.forEach((item: FormControl) => {
                    if (item.value == this.otherCategory.value) {
                        categories.removeAt(i);
                        return;
                    }
                    i++;
                });
                this.otherCategorySelected = false;
                this.otherCategory.setValue("");
            }
            categories.controls.forEach((item: FormControl) => {
                if (item.value == e.target.value) {
                    categories.removeAt(i);
                    return;
                }
                i++;
            });
        }
    }
    afterClose(){
        console.log("this.categoryForm.value.category",this.categoryForm.value.category);
        // this.onSelectionChange()
        

        this._matDialogRef.close();
        
    }

    proceed(): void {
        if (this.categoryForm.invalid) {
            return;
        }
        this._matDialogRef.close(this.categoryForm.value.category);
    }

    checkIfValueSelected(value: string) {
        let retValue: boolean = false;
        if (this.selectedCategories?.length > 0) {
            retValue = this.selectedCategories.includes(value);
        }
        return retValue;
    }
}