import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';

import { SharedModule } from 'app/shared/shared.module';
import { PaymentGuidelinesPopupComponent } from 'app/layout/common/payment-guidelines-popup/payment-guidelines-popup.component';

@NgModule({
    declarations: [
        PaymentGuidelinesPopupComponent
    ],
    imports: [
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        SharedModule
    ],
    exports: [
        PaymentGuidelinesPopupComponent
    ]
})
export class PaymentGuidelinesPopupModule {
}
