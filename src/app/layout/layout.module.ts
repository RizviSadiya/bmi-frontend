import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BmiDrawerModule } from '@bmi/components/drawer';
import { LayoutComponent } from 'app/layout/layout.component';
import { EmptyLayoutModule } from 'app/layout/layouts/empty/empty.module';
import { VerticalLayoutModule } from 'app/layout/layouts/vertical/vertical.module';
import { BeforeLoginLayoutModule } from 'app/layout/layouts/before-login/before-login.module';
import { SharedModule } from 'app/shared/shared.module';


const layoutModules = [
    // Empty
    EmptyLayoutModule,

    // Vertical navigation
    VerticalLayoutModule,

    // Before Login naviagtion
    BeforeLoginLayoutModule
];

@NgModule({
    declarations: [
        LayoutComponent,
 
      
       
      
    ],
    imports: [
        MatIconModule,
        MatTooltipModule,
        BmiDrawerModule,
        SharedModule,
        ...layoutModules,
    ],
    exports     : [
        LayoutComponent,
        ...layoutModules
    ]
})
export class LayoutModule
{
}
