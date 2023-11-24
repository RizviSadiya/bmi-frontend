import { NgModule } from '@angular/core';
import { BmiUtilsService } from '@bmi/services/utils/utils.service';

@NgModule({
    providers: [
        BmiUtilsService
    ]
})
export class BmiUtilsModule
{
    /**
     * Constructor
     */
    constructor(private _fuseUtilsService: BmiUtilsService)
    {
    }
}
