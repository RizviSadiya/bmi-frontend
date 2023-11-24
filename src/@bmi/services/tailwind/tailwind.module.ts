import { NgModule } from '@angular/core';
import { BmiTailwindService } from '@bmi/services/tailwind/tailwind.service';

@NgModule({
    providers: [
        BmiTailwindService
    ]
})
export class BmiTailwindConfigModule
{
    /**
     * Constructor
     */
    constructor(private _fuseTailwindConfigService: BmiTailwindService)
    {
    }
}
