import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';


@Component({
    selector       : 'camplive',
    templateUrl    : './camplive.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampliveComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
