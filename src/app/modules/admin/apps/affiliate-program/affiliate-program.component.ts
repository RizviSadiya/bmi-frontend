import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BmiAlertType } from '@bmi/components/alert';
import { bmiAnimations } from '@bmi/animations';

import { Affiliate } from 'app/modules/admin/apps/affiliate-program/affiliate-program.types';
import { AffiliateProgramService } from 'app/modules/admin/apps/affiliate-program/affiliate-program.service';

@Component({
    selector: 'affiliate-program',
    templateUrl: './affiliate-program.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: bmiAnimations
})
export class AffiliateProgramComponent implements OnInit, OnDestroy {
    affiliate: Affiliate;
    affiliateForm: FormGroup;
    affiliattionSelected: boolean = false;
    submitted: boolean = false;
    alert: { type: BmiAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetector: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _affiliateService: AffiliateProgramService,
    ) {
    }

    ngOnInit(): void {
        this._affiliateService.affiliate$.subscribe(data => {
            if (data) {
                this.affiliattionSelected = data === 1 ? true : false;
                this.alert = {
                    type: 'success',
                    message: 'Congratulations! You have subscribed to our affiliate program.'
                };
            } else {
                this.affiliattionSelected = false;
            }
            this._changeDetector.markForCheck();
        });
        // Create the affiliate form
        this.affiliateForm = this._formBuilder.group({
            affiliate: ['', [Validators.required]],
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    optForAffitiate(): void {
        this.submitted = true;
        this._affiliateService.optAffiliateProgram().subscribe(
            data => {
                if (data.success) {
                    this.affiliattionSelected = true;
                    this.alert = {
                        type: 'success',
                        message: 'Congratulations! You have subscribed to our affiliate program.'
                    };
                } else {
                    this.affiliattionSelected = false;
                }
                this.submitted = false;
                this._changeDetector.markForCheck();
            });
    }
}
