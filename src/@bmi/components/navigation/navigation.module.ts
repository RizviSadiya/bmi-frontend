import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { BmiScrollbarModule } from '@bmi/directives/scrollbar/public-api';
import { BmiHorizontalNavigationBasicItemComponent } from '@bmi/components/navigation/horizontal/components/basic/basic.component';
import { BmiHorizontalNavigationBranchItemComponent } from '@bmi/components/navigation/horizontal/components/branch/branch.component';
import { BmiHorizontalNavigationDividerItemComponent } from '@bmi/components/navigation/horizontal/components/divider/divider.component';
import { BmiHorizontalNavigationSpacerItemComponent } from '@bmi/components/navigation/horizontal/components/spacer/spacer.component';
import { BmiHorizontalNavigationComponent } from '@bmi/components/navigation/horizontal/horizontal.component';
import { BmiVerticalNavigationAsideItemComponent } from '@bmi/components/navigation/vertical/components/aside/aside.component';
import { BmiVerticalNavigationBasicItemComponent } from '@bmi/components/navigation/vertical/components/basic/basic.component';
import { BmiVerticalNavigationCollapsableItemComponent } from '@bmi/components/navigation/vertical/components/collapsable/collapsable.component';
import { BmiVerticalNavigationDividerItemComponent } from '@bmi/components/navigation/vertical/components/divider/divider.component';
import { BmiVerticalNavigationGroupItemComponent } from '@bmi/components/navigation/vertical/components/group/group.component';
import { BmiVerticalNavigationSpacerItemComponent } from '@bmi/components/navigation/vertical/components/spacer/spacer.component';
import { BmiVerticalNavigationComponent } from '@bmi/components/navigation/vertical/vertical.component';
import { CreditTopupComponent } from 'app/layout/common/credit-topup/credit-topup.component';

@NgModule({
    declarations: [
        BmiHorizontalNavigationBasicItemComponent,
        BmiHorizontalNavigationBranchItemComponent,
        BmiHorizontalNavigationDividerItemComponent,
        BmiHorizontalNavigationSpacerItemComponent,
        BmiHorizontalNavigationComponent,
        BmiVerticalNavigationAsideItemComponent,
        BmiVerticalNavigationBasicItemComponent,
        BmiVerticalNavigationCollapsableItemComponent,
        BmiVerticalNavigationDividerItemComponent,
        BmiVerticalNavigationGroupItemComponent,
        BmiVerticalNavigationSpacerItemComponent,
        BmiVerticalNavigationComponent,
        CreditTopupComponent
    ],
    imports     : [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,
        MatProgressBarModule,
        MatDialogModule,
        BmiScrollbarModule
    ],
    exports     : [
        BmiHorizontalNavigationComponent,
        BmiVerticalNavigationComponent
    ]
})
export class BmiNavigationModule
{
}
