import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BmiAlertType } from '@bmi/components/alert';
import { bmiAnimations } from '@bmi/animations';

import { Management } from 'app/modules/admin/apps/management-services/management-services.types';
import { ManagementServiceService } from 'app/modules/admin/apps/management-services/management-services.service';
import { ManagementServicesFeaturesComponent } from 'app/modules/admin/apps/management-services/features/features.component';

@Component({
    selector: 'management-services',
    templateUrl: './management-services.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: bmiAnimations
})
export class ManagementServicesComponent implements OnInit, OnDestroy {
    management: Management;
    managementForm: FormGroup;
    servicesSelected: boolean = false;
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
        private _managementService: ManagementServiceService,
        private _matDialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this._managementService.management$.subscribe(data => {
            if (data) {
                this.servicesSelected = data === 1 ? true : false;
                this.alert = {
                    type: 'success',
                    message: 'Thanks. We have received your interest for Management service. Our team will be in touch with you shortly.'
                };
            } else {
                this.servicesSelected = false;
            }
            this._changeDetector.markForCheck();
        });

        // Create the management form
        this.managementForm = this._formBuilder.group({
            management: ['', [Validators.required]],
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    optForServices(): void {
        this.submitted = true;

        this._managementService.optManagementService().subscribe(
            data => {
                if (data.success) {
                    this.servicesSelected = true;
                    this.alert = {
                        type: 'success',
                        message: 'Thanks. We have received your interest for Management service. Our team will be in touch with you shortly.'
                    };
                }
                this.submitted = false;
                this._changeDetector.markForCheck();
            });
    }

    /**
     * Show feature modal
     */
    showFeaures(): void {
        this.submitted = true;
        this._matDialog.open(ManagementServicesFeaturesComponent, {
            maxHeight: '100vh',
            autoFocus: false
        }).afterClosed().subscribe(
            data => {
                if (data) {
                    this.optForServices();
                } else {
                    this.submitted = false;
                }
                this._changeDetector.markForCheck();
            }
        );
    }
}
