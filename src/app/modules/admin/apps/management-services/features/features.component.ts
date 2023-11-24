import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'management-services-features',
    templateUrl: './features.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManagementServicesFeaturesComponent {

    /**
     * Constructor
     */
    constructor(
        private _matDialogRef: MatDialogRef<ManagementServicesFeaturesComponent>
    ) {
    }

    optForService() {
        this._matDialogRef.close(true);
    }

    closeDialog() {
        // Close the dialog
        this._matDialogRef.close();
    }
}
