import { NgModule } from '@angular/core';
import { BmiSplashScreenService } from '@bmi/services/splash-screen/splash-screen.service';

@NgModule({
    providers: [
        BmiSplashScreenService
    ]
})
export class BmiSplashScreenModule
{
    /**
     * Constructor
     */
    constructor(private _fuseSplashScreenService: BmiSplashScreenService)
    {
    }
}
