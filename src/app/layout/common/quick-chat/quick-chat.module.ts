import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BmiDrawerModule } from '@bmi/components/drawer';
import { BmiScrollbarModule } from '@bmi/directives/scrollbar';
import { SharedModule } from 'app/shared/shared.module';
import { QuickChatComponent } from 'app/layout/common/quick-chat/quick-chat.component';
import { ChatConnectService } from 'app/core/services/chat.service';

@NgModule({
    declarations: [
        QuickChatComponent
    ],
    imports: [
        RouterModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        BmiDrawerModule,
        BmiScrollbarModule,
        SharedModule,
    ],
    providers:[ChatConnectService],
    exports     : [
        QuickChatComponent
    ]
})
export class QuickChatModule
{
}
