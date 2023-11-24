import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

import { Campaign } from 'app/modules/admin/apps/campaigns/campaigns.types';
import { Brand } from './single-brand.types';

@Component({
    selector       : 'single-brand',
    templateUrl    : './single-brand.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleBrandComponent implements OnInit, OnDestroy
{
    @Input() brand: Brand;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _sanitizer: DomSanitizer
    )
    {}

    ngOnInit(): void
    {}

    safeUrl(videoURL) {
        return this._sanitizer.bypassSecurityTrustResourceUrl(videoURL);
    }

    ngOnDestroy(): void
    {}
}