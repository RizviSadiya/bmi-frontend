import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { MatDialog } from '@angular/material/dialog';
import { AddMoneyPopupComponent } from '../add-money-popup/add-money-popup.component';

@Component({
    selector: 'wallet',
    templateUrl: './wallet.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'wallet'
})
export class WalletComponent implements OnInit, OnDestroy {
    user: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetector: ChangeDetectorRef,
        private _matDialog: MatDialog,
        private _router: Router,
        private _userService: UserService
    ) { }

    ngOnInit(): void {
        this._userService.user$.subscribe(data => {
            this.user = data;
            this._changeDetector.markForCheck();
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Update the user status
     *
     * @param status
     */
    addMoney(): void {
        this._matDialog.open(AddMoneyPopupComponent, {
            autoFocus: false,
            data: {
                amount: 0
            }
        });
    }
}
