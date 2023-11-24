import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'wallet-history',
    templateUrl    : './history.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletHistoryComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
