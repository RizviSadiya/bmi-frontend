import { Component, ViewEncapsulation } from '@angular/core';
import { bmiAnimations } from '@bmi/animations';

@Component({
    selector     : 'auth-choose-plan',
    templateUrl  : './choose-plan.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : bmiAnimations
})
export class AuthChoosePlanComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
