import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BmiConfirmationService } from '@bmi/services/confirmation/confirmation.service';
import { BmiConfirmationDialogComponent } from '@bmi/services/confirmation/dialog/dialog.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        BmiConfirmationDialogComponent
    ],
    imports: [
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        CommonModule
    ],
    providers   : [
        BmiConfirmationService
    ]
})
export class BmiConfirmationModule
{
    /**
     * Constructor
     */
    constructor(private _fuseConfirmationService: BmiConfirmationService)
    {
    }
}
