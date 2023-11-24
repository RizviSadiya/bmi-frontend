import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { MoreLessTextComponent } from 'app/layout/common/more-less-text/more-less-text.component';

@NgModule({
    declarations: [
        MoreLessTextComponent
    ],
    imports: [
        SharedModule
    ],
    exports: [
        MoreLessTextComponent
    ]
})
export class MoreLessTextModule {
}
