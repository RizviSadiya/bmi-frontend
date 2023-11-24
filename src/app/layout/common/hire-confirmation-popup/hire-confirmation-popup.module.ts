import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

import { SharedModule } from 'app/shared/shared.module';
import { HireConfirmationPopupComponent } from 'app/layout/common/hire-confirmation-popup/hire-confirmation-popup.component';

@NgModule({
    declarations: [
        HireConfirmationPopupComponent
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
        HireConfirmationPopupComponent
    ]
})
export class HireConfirmationPopupModule {
}
