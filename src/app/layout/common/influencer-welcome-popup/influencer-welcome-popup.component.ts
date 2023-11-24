import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'influencer-welcome-popup',
    templateUrl: './influencer-welcome-popup.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfluencerWelcomePopupComponent {

    constructor(
        private _matDialogRef: MatDialogRef<InfluencerWelcomePopupComponent>,
    ) { }

    verifyChannel(): void {
        this._matDialogRef.close(true);
    }
}