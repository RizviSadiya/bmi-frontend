import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'wallet-billing',
    templateUrl    : './billing.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletBillingComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
