import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CampliveComponent } from 'app/modules/admin/pages/newdesign/camplive/camplive.component';
import { CampliveRoutes } from 'app/modules/admin/pages/newdesign/camplive/camplive.routing';

@NgModule({
    declarations: [
     CampliveComponent,
    ],
    imports     : [
        RouterModule.forChild(CampliveRoutes),
     CommonModule

    ]
})
export class CampliveModule
{
}
