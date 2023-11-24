import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// import { CampliveComponent } from 'app/modules/admin/pages/newdesign/camplive/camplive.component';
import { CampliveRoutes } from 'app/modules/admin/pages/newdesign/camplive/camplive.routing';

@NgModule({
    declarations: [
    //  CampliveComponent
    ],
    imports     : [
        RouterModule.forChild(CampliveRoutes)
    ]
})
export class CampliveModule
{
}
