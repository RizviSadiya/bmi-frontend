import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BmiCardModule } from '@bmi/components/card';
import { GettingStartedComponent } from 'app/layout/common/getting-started/getting-started.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [
        GettingStartedComponent
    ],
    imports: [
        MatButtonModule,
        RouterModule,
        BmiCardModule,
        SharedModule
    ],
    exports: [
        GettingStartedComponent
    ]
})
export class GettingStartedModule {
}
