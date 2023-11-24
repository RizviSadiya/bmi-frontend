import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

import { SharedModule } from 'app/shared/shared.module';
import { HireconfirmationpaymentPopupComponent } from 'app/layout/common/hire-confirmationpayment-popup/hire-confirmationpayment-popup.component';

@NgModule({
    declarations: [
        HireconfirmationpaymentPopupComponent
    ],
    imports: [
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatRadioModule,
        SharedModule
    ],
    exports: [
        HireconfirmationpaymentPopupComponent
    ]
})
export class HireConfirmationpaymentPopupModule {
}
