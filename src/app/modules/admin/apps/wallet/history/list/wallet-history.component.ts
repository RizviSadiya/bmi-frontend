import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { bmiAnimations } from '@bmi/animations';
import { BmiConfirmationService } from '@bmi/services/confirmation';
import { WalletService } from 'app/layout/common/wallet/wallet.service';
import { WalletHistoryService } from '../history.service';
import { AddMoneyPopupComponent } from 'app/layout/common/add-money-popup/add-money-popup.component';
import { UserService } from 'app/core/user/user.service';

@Component({
    selector: 'wallet-history-list',
    templateUrl: './wallet-history.component.html',
    styles: [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 112px auto 112px 72px;
                }

                @screen lg {
                    grid-template-columns: 48px 112px auto 112px 96px 96px 72px;
                }
            }
        `
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: bmiAnimations
})
export class WalletHistoryListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: any;
    searchInputControl: FormControl = new FormControl();
    selectedProductForm: FormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    transactions: any;
    pageIndex: number = 0;
    pageSize = 10;
    userPlan: any;
    userDetails: any;
    userType: string = "INFLUENCER";

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: BmiConfirmationService,
        private _formBuilder: FormBuilder,
        private _walletService: WalletHistoryService,
        private _matDialog: MatDialog,
        private _userService: UserService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.getTransactionDetailsFromServer();
        this.userPlan = this._userService.userDetails.plan_id;
        this.userDetails = this._userService.userDetails;
        this.userType = this._userService.userDetails.userType.toUpperCase();
console.log("userType",this.userType)
        this._walletService.transactions$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((transactions: any) => {
                // Update the pagination
                this.transactions = transactions;
              
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
          

        // Get the pagination
        this._walletService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: any) => {
                // Update the pagination
                this.pagination = pagination;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        
    }
    paginator=false;
    onChangePage(event) {
        this.pageIndex = event.pageIndex;
        this.getTransactionDetailsFromServer();
    }

    getTransactionDetailsFromServer() {
        this.transactions = [];
        this._walletService.getWallets(1, this.pageIndex + 1, this.pageSize).subscribe(data => {
            console.log(data)
            if (data['success']) {
                this.transactions = data['payload'].data;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    /* addMoney() {
        const addMoneyPopup = this._matDialog.open(AddMoneyPopupComponent, {
            autoFocus: false,
            data: {
                amount: this.searchInputControl.value
            }
        });

        addMoneyPopup.afterClosed().subscribe(result => {
            console.log(result);
        });
    } */

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        if (this._sort && this._paginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'name',
                start: 'asc',
                disableClear: true
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });
        }
    }

    addMoney(): void {
        this._matDialog.open(AddMoneyPopupComponent, {
            autoFocus: false,
            data: {
                amount: 0
            }
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the details
     */
    closeDetails(): void {
        // this.selectedProduct = null;
    }

    /**
     * Cycle through images of selected product
     */
    cycleImages(forward: boolean = true): void {
        // Get the image count and current image index
        const count = this.selectedProductForm.get('images').value.length;
        const currentIndex = this.selectedProductForm.get('currentImageIndex').value;

        // Calculate the next and previous index
        const nextIndex = currentIndex + 1 === count ? 0 : currentIndex + 1;
        const prevIndex = currentIndex - 1 < 0 ? count - 1 : currentIndex - 1;

        // If cycling forward...
        if (forward) {
            this.selectedProductForm.get('currentImageIndex').setValue(nextIndex);
        }
        // If cycling backwards...
        else {
            this.selectedProductForm.get('currentImageIndex').setValue(prevIndex);
        }
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
