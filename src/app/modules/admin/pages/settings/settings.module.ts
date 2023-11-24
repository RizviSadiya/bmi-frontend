import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { BmiAlertModule } from '@bmi/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { SettingsComponent } from 'app/modules/admin/pages/settings/settings.component';
import { SettingsPaymentComponent } from 'app/modules/admin/pages/settings/payment/payment.component';
import { SettingsBillingComponent } from 'app/modules/admin/pages/settings/billing/billing.component';
import { SettingsPersonalInformationComponent } from 'app/modules/admin/pages/settings/personal-information/personal-information.component';
import { SettingsAccountComponent } from 'app/modules/admin/pages/settings/account/account.component';
import { SettingsPreferencesComponent } from 'app/modules/admin/pages/settings/preferences/preferences.component';
import { settingsRoutes } from 'app/modules/admin/pages/settings/settings.routing';
import { ChangePasswordComponent } from 'app/layout/common/change-password/change-password.component';

@NgModule({
    declarations: [
        SettingsComponent,
        SettingsPaymentComponent,
        SettingsBillingComponent,
        SettingsPersonalInformationComponent,
        SettingsAccountComponent,
        SettingsPreferencesComponent,
        ChangePasswordComponent
    ],
    imports: [
        RouterModule.forChild(settingsRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatSidenavModule,
        MatDialogModule,
        MatSlideToggleModule,
        BmiAlertModule,
        SharedModule
    ],
    exports: [ChangePasswordComponent]
})
export class SettingsModule {
}
