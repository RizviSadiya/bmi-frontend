import { ModuleWithProviders, NgModule } from '@angular/core';
import { BmiConfigService } from '@bmi/services/config/config.service';
import { FUSE_APP_CONFIG } from '@bmi/services/config/config.constants';

@NgModule()
export class BmiConfigModule
{
    /**
     * Constructor
     */
    constructor(private _fuseConfigService: BmiConfigService)
    {
    }

    /**
     * forRoot method for setting user configuration
     *
     * @param config
     */
    static forRoot(config: any): ModuleWithProviders<BmiConfigModule>
    {
        return {
            ngModule : BmiConfigModule,
            providers: [
                {
                    provide : FUSE_APP_CONFIG,
                    useValue: config
                }
            ]
        };
    }
}
