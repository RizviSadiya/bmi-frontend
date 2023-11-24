import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'applications',
    templateUrl    : './applications.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationsComponent
{
    /**
     * Constructor
     */
    constructor()
    {
     
    }
}
