import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { SharedModule } from 'app/shared/shared.module';
import { ReviewProposalComponent } from 'app/layout/common/review-proposal/review-proposal.component';

@NgModule({
    declarations: [
        ReviewProposalComponent
    ],
    imports: [
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatIconModule,
        SharedModule
    ],
    exports: [
        ReviewProposalComponent
    ]
})
export class ReviewProposalModule {
}
