import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BmiNavigationModule } from '@bmi/components/navigation';
import { BmiFullscreenModule } from '@bmi/components/fullscreen/fullscreen.module';
import { NotificationsModule } from 'app/layout/common/notifications/notifications.module';
import { QuickChatModule } from 'app/layout/common/quick-chat/quick-chat.module';
import { SearchModule } from 'app/layout/common/search/search.module';
import { UserModule } from 'app/layout/common/user/user.module';
import { WalletModule } from 'app/layout/common/wallet/wallet.module';
import { SharedModule } from 'app/shared/shared.module';
import { VerticalLayoutComponent } from 'app/layout/layouts/vertical/vertical.component';

@NgModule({
    declarations: [
        VerticalLayoutComponent
    ],
    imports     : [
        HttpClientModule,
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        BmiFullscreenModule,
        BmiNavigationModule,
        NotificationsModule,
        QuickChatModule,
        SearchModule,
        UserModule,
        WalletModule,
        SharedModule
    ],
    exports     : [
        VerticalLayoutComponent
    ]
})
export class VerticalLayoutModule
{
}
