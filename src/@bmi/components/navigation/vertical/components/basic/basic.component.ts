import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IsActiveMatchOptions } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { BmiVerticalNavigationComponent } from '@bmi/components/navigation/vertical/vertical.component';
import { BmiNavigationService } from '@bmi/components/navigation/navigation.service';
import {RelationManager} from 'app/layout/common/relation-manager/relation-manager.component';
import { BmiNavigationItem } from '@bmi/components/navigation/navigation.types';
import { BmiUtilsService } from '@bmi/services/utils/utils.service';
import { QuickChatService } from 'app/layout/common/quick-chat/quick-chat.service';

@Component({
    selector: 'fuse-vertical-navigation-basic-item',
    templateUrl: './basic.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BmiVerticalNavigationBasicItemComponent implements OnInit, OnDestroy {
    @Input() item: BmiNavigationItem;
    @Input() name: string;

    isActiveMatchOptions: IsActiveMatchOptions;
    private _fuseVerticalNavigationComponent: BmiVerticalNavigationComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: BmiNavigationService,
        private _fuseUtilsService: BmiUtilsService,
        private _quickChatService: QuickChatService,
        private _matDialog: MatDialog
    ) {
        // Set the equivalent of {exact: false} as default for active match options.
        // We are not assigning the item.isActiveMatchOptions directly to the
        // [routerLinkActiveOptions] because if it's "undefined" initially, the router
        // will throw an error and stop working.
        this.isActiveMatchOptions = this._fuseUtilsService.subsetMatchOptions;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Set the "isActiveMatchOptions" either from item's
        // "isActiveMatchOptions" or the equivalent form of
        // item's "exactMatch" option
        // console.log("item",this.item);
        
        this.isActiveMatchOptions =
            this.item.isActiveMatchOptions ?? this.item.exactMatch
                ? this._fuseUtilsService.exactMatchOptions
                : this._fuseUtilsService.subsetMatchOptions;

        // Get the parent navigation component
        this._fuseVerticalNavigationComponent = this._fuseNavigationService.getComponent(this.name);

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Subscribe to onRefreshed on the navigation component
        this._fuseVerticalNavigationComponent.onRefreshed.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe(() => {
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        this._fuseNavigationService.menuRefreshed$.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((value) => {
            if (value) {
                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });
    }
    user_id=2
    handleCall(value: string,item) {
        console.log("value",value, "item", item.title);
        item=2
        if (value === "openQuickChat") {
            // if(item.title =='Inbox'){
                let payload={
                    "user_id":item
                }
        // this._quickChatService.getChatById(item).subscribe();
        this._quickChatService.getChatById(item).subscribe();

            // }else{
            // //  this._quickChatService.toggleChat(true);
            // this._quickChatService.getChatById(item).subscribe();


            // }
        // this._quickChatService.getChatById(item).subscribe();;
          
        }
        if (value === "openrelationmanagerpopup") {
            this._matDialog.open(RelationManager, {
                autoFocus: false,

            });
        }

    
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
