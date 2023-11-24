import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
    selector: 'getting-started',
    templateUrl: './getting-started.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'gettingStarted'
})
export class GettingStartedComponent implements OnInit {
    @Input() userType: string;
    constructor() { }

    ngOnInit(): void { }
}
