import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { Campaign } from 'app/modules/admin/apps/campaigns/campaigns.types';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'payment-guidelines-popup',
    templateUrl: './payment-guidelines-popup.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentGuidelinesPopupComponent implements OnInit, OnDestroy {
    priceForm: FormGroup;
    currency: string;
    disable:boolean = true

    constructor(
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialogRef: MatDialogRef<PaymentGuidelinesPopupComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: { campaign: Campaign },
    ) { }

    ngOnInit(): void {
    }

    submitApplication(): void {
        this._matDialogRef.close(true);
    }

    ngOnDestroy(): void {

    }
}