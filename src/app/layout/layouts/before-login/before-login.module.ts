import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { BeforeLoginLayoutComponent } from 'app/layout/layouts/before-login/before-login.component';

@NgModule({
    declarations: [
        BeforeLoginLayoutComponent
    ],
    imports     : [
        RouterModule,
        MatIconModule,
        SharedModule
    ],
    exports     : [
        BeforeLoginLayoutComponent
    ]
})
export class BeforeLoginLayoutModule
{
}
