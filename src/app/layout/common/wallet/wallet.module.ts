import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { WalletComponent } from 'app/layout/common/wallet/wallet.component';
import { AddMoneyPopupComponent } from '../add-money-popup/add-money-popup.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [
        WalletComponent,
        AddMoneyPopupComponent
    ],
    imports     : [
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatInputModule,
        MatSelectModule,
        MatDialogModule,
        RouterModule,
        SharedModule
    ],
    exports     : [
        WalletComponent
    ]
})
export class WalletModule
{
}
