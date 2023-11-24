import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ComingSoonComponent } from 'app/layout/common/coming-soon/coming-soon.component';

@NgModule({
    declarations: [
        ComingSoonComponent
    ],
    imports: [
        SharedModule
    ],
    exports: [
        ComingSoonComponent
    ]
})
export class ComingSoonModule {
}
