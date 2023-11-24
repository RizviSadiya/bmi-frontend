import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'coming-soon',
    templateUrl    : './coming-soon.component.html',
    styleUrls: ['./coming-soon.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComingSoonComponent implements OnInit
{

    constructor()
    {}

    ngOnInit(): void
    {}
}