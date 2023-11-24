import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UploadscriptComponent } from 'app/modules/admin/pages/newdesign/uploadscript/uploadscript.component';
import { UploadscriptRoutes } from 'app/modules/admin/pages/newdesign/uploadscript/uploadscript.routing';

@NgModule({
    declarations: [
     UploadscriptComponent
    ],
    imports     : [
        RouterModule.forChild(UploadscriptRoutes)
    ]
})
export class UploadscriptModule
{
}

