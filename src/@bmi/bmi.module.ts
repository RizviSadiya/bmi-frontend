import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BmiConfirmationModule } from '@bmi/services/confirmation';
import { BmiMediaWatcherModule } from '@bmi/services/media-watcher/media-watcher.module';
import { BmiSplashScreenModule } from '@bmi/services/splash-screen/splash-screen.module';
import { HttpLoaderScreenModule } from '@bmi/services/http-loader-screen';
import { BmiTailwindConfigModule } from '@bmi/services/tailwind/tailwind.module';
import { BmiUtilsModule } from '@bmi/services/utils/utils.module';

@NgModule({
    imports  : [
        BmiConfirmationModule,
        BmiMediaWatcherModule,
        BmiSplashScreenModule,
        HttpLoaderScreenModule,
        BmiTailwindConfigModule,
        BmiUtilsModule
    ],
    providers: [
        {
            // Disable 'theme' sanity check
            provide : MATERIAL_SANITY_CHECKS,
            useValue: {
                doctype: true,
                theme  : false,
                version: true
            }
        },
        {
            // Use the 'fill' appearance on Angular Material form fields by default
            provide : MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'fill'
            }
        }
    ]
})
export class BmiModule
{
    /**
     * Constructor
     */
    constructor(@Optional() @SkipSelf() parentModule?: BmiModule)
    {
        if ( parentModule )
        {
            throw new Error('BmiModule has already been loaded. Import this module in the AppModule only!');
        }
    }
}
