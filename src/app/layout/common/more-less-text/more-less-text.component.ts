import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'app-more-less-text',
    templateUrl    : './more-less-text.component.html',
    styleUrls: ['./more-less-text.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoreLessTextComponent implements OnInit
{
    @Input() text: string;
    @Input() wordLimit: number;
    showMore: boolean = false;
    
    constructor()
    {}

    ngOnInit(): void
    {}
}