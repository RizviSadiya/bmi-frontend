import { ChangeDetectionStrategy, Component, ViewEncapsulation, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import { BrandsService } from './brands.service';

@Component({
    selector: 'brands',
    templateUrl: './brands.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandsComponent implements OnInit, OnDestroy {
    data: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(private _brandService: BrandsService,
        private _sanitizer: DomSanitizer) {
    }

    ngOnInit(): void {
        // Get the data
        this._brandService.getBrands().subscribe((data) => {
            this.data = data;
        });
    }

    safeUrl(videoURL) {
        return this._sanitizer.bypassSecurityTrustResourceUrl(videoURL);
    }

    /**
    * On destroy
    */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
