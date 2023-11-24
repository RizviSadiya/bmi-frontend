import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, map, startWith, takeUntil } from 'rxjs/operators';
import { bmiAnimations } from '@bmi/animations/public-api';
import { CampaignsService } from 'app/modules/admin/apps/campaigns/campaigns.service';

@Component({
    selector: 'search',
    templateUrl: './search.component.html',
    encapsulation: ViewEncapsulation.None,
    exportAs: 'bmiSearch',
    animations: bmiAnimations
})
export class SearchComponent implements OnChanges, OnInit, OnDestroy {
    @Input() appearance: 'basic' | 'bar' = 'basic';
    @Input() debounce: number = 5000;
    @Input() minLength: number = 3;
    @Output() search: EventEmitter<any> = new EventEmitter<any>();

    opened: boolean = false;
    resultSets: any[];
    searchControl: FormControl = new FormControl();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    categoriesData: any;
    filteredOptions;

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _elementRef: ElementRef,
        private _httpClient: HttpClient,
        private _renderer2: Renderer2,
        private _changeDetectorRef: ChangeDetectorRef,
        private _campaignsService: CampaignsService
    ) {
        this._router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Host binding for component classes
     */
    @HostBinding('class') get classList(): any {
        return {
            'search-appearance-bar': this.appearance === 'bar',
            'search-appearance-basic': this.appearance === 'basic',
            'search-opened': this.opened
        };
    }

    /**
     * Setter for bar search input
     *
     * @param value
     */
    @ViewChild('barSearchInput')
    set barSearchInput(value: ElementRef) {
        // If the value exists, it means that the search input
        // is now in the DOM and we can focus on the input..
        if (value) {
            // Give Angular time to complete the change detection cycle
            setTimeout(() => {

                // Focus to the input element
                value.nativeElement.focus();
            });
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On changes
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void {
        // Appearance
        if ('appearance' in changes) {
            // To prevent any issues, close the
            // search after changing the appearance
            this.close();
        }
    }

    /**
     * On init
     */
    ngOnInit(): void {
        // If user is on searched screen (/apps/influencers), show the search icon open with text
        if (this._router.url.indexOf('/influencers') > -1) {
            let searchString = this._router.url.split('/')[3]
            this.searchControl.setValue(decodeURI(searchString));
            if (searchString && searchString.length >= this.minLength) {
                this.open();
            }
        }

        // Subscribe to the search field value changes
        this.searchControl.valueChanges
            .pipe(
                debounceTime(this.debounce),
                distinctUntilChanged(),
                takeUntil(this._unsubscribeAll),
                map((value) => {
                    // Set the resultSets to null if there is no value or
                    // the length of the value is smaller than the minLength
                    // so the autocomplete panel can be closed
                    if (!value || value.length < this.minLength) {
                        this.resultSets = null;
                    }

                    // Continue
                    return value;
                }),
                // Filter out undefined/null/false statements and also
                // filter out the values that are smaller than minLength
                filter(value => value && value.length >= this.minLength)
            )
            .subscribe((value) => {
                this._router.navigate(['/apps/influencers', value]);
            });

        // if (!this.categoriesData) {
        //     this._campaignsService.getCategoryList().subscribe((data) => {
        //         if (data.success) {
        //             this.categoriesData = data.payload;
        //             this.resultSets = data.payload
        //             this._changeDetectorRef.markForCheck();
        //         }
        //     });
        // }

        this.filteredOptions = this.searchControl.valueChanges
            .pipe(startWith(''),
                map(value => this._filter(value))
            );
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getCategory(){
         if (!this.categoriesData) {
            this._campaignsService.getCategoryList().subscribe((data) => {
                if (data.success) {
                    this.categoriesData = data.payload;
                    this.resultSets = data.payload
                    this.filteredOptions = data.payload
                    console.log("filteredOptions",this.filteredOptions);
                    
                    this._changeDetectorRef.markForCheck();
                }
            });
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    searchInfluencer() {
        let searchValue = this.searchControl.value;
        console.log("searchValue",searchValue);
        
        if (searchValue.length >= this.minLength) {
            this._router.navigate(['/apps/influencers', searchValue]);
        }
    }

    onEnter() {
        console.log(this.searchControl.value);
        let searchValue = this.searchControl.value;
        if (searchValue.length >= this.minLength) {
            this._router.navigate(['/apps/influencers', searchValue]);
        }
    }

    onResultSelection(e) {
        this.searchControl.setValue(e);
        this._router.navigate(['/apps/influencers', e]);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        if (this.categoriesData) {
            return this.categoriesData.filter(option => option.name.toLowerCase().includes(filterValue));
        }
    }

    /**
     * On keydown of the search input
     *
     * @param event
     */
    onKeydown(event: KeyboardEvent): void {
        // Listen for escape to close the search
        // if the appearance is 'bar'
        if (this.appearance === 'bar') {

            // Escape
            if (event.code === 'Escape') {
                // Close the search
                this.close();
            }
        }
    }

    /**
     * Open the search
     * Used in 'bar'
     */
    open(): void {
        // Return if it's already opened
        if (this.opened) {
            return;
        }

        // Open the search
        this.opened = true;
    }

    /**
     * Close the search
     * * Used in 'bar'
     */
    close(): void {
        // Return if it's already closed
        if (!this.opened) {
            return;
        }

        // Clear the search input
        this.searchControl.setValue('');

        // Close the search
        this.opened = false;
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
