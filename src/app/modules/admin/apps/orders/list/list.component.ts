import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';

import { BmiMediaWatcherService } from '@bmi/services/media-watcher';
import { Order } from 'app/modules/admin/apps/orders/orders.types';
import { OrdersService } from 'app/modules/admin/apps/orders/orders.service';
import { Campaign } from 'app/modules/admin/apps/campaigns/campaigns.types';

@Component({
    selector: 'orders-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersListComponent implements OnInit, OnDestroy {
    @ViewChild('orderDrawer', { static: true }) orderDrawer: MatDrawer;

    orders$: Observable<Order[]>;
    instaOrders$: Observable<Order[]>;

    ordersCount: number = 0;
    liveCount: number = 0;
    completedCount: number = 0;
    cancelledCount: number = 0;
    drawerMode: 'side' | 'over';
    searchInputControl: FormControl = new FormControl();
    selectedCampaign: Order;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    cancelOrderForm: FormGroup;
    selectedTabIndex: number = 0;
    paginationCount: number = 0;
pagination=true
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _ordersService: OrdersService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _formBuilder: FormBuilder,
        private _fuseMediaWatcherService: BmiMediaWatcherService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the camapigns
        this.orders$ = this._ordersService.orders$;
        this._ordersService.totalOrdersCount$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.ordersCount = count;
                this._changeDetectorRef.markForCheck();
            });
        this._ordersService.liveOrdersCount$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.liveCount = count;
                this._changeDetectorRef.markForCheck();
            });
        this._ordersService.totalpaginationCount$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.paginationCount = count;
                this._changeDetectorRef.markForCheck();
            });
        this._ordersService.completedOrdersCount$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.completedCount = count;
                this._changeDetectorRef.markForCheck();
            });
        this._ordersService.cancelledOrdersCount$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.cancelledCount = count;
                this._changeDetectorRef.markForCheck();
            });

        // Get the campaign
        this._ordersService.order$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((campaign: Order) => {

                // Update the selected campaign
                this.selectedCampaign = campaign;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to orderDrawer opened change
        this.orderDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                // Remove the selected campaign when drawer closed
                this.selectedCampaign = null;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {

                // Set the drawerMode if the given breakpoint is active
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'over';
                }
                else {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


        this.cancelOrderForm = this._formBuilder.group({
            title: 'Cancel Order',
            message: 'Are you sure you want to cancel this order?',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:exclamation',
                color: 'warn'
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Yes',
                    color: 'warn'
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Cancel'
                })
            }),
            dismissible: true
        });
    }

    index=0
    filterStatus:any='0'
    onChangePage(event) {
        console.log("event",event);
        
        this.pageIndex = event.pageIndex;
        if(this.index===0){
this.filterStatus='0'
this.getOrderlistFromServer();

        }
        if(this.index===1){
this.filterStatus='2'
this.getOrderlistFromServer();

        }
        if(this.index===2){
this.filterStatus='1'
this.getOrderlistFromServer();

        }
        this.currentPage = event.pageIndex;
        this.pageSize = event.pageSize
    }

   scroll(el:HTMLElement){
    el.scrollIntoView({ behavior: 'smooth' });

   }

    transactions: any;
    orders: any;
    channels;
    pageIndex: number = 1;
    currentPage = 0;
    pageSize = 10;
    getOrderlistFromServer() {
        this.transactions = [];
        let payload = {
            // "limit": this.pageSize,
            "page": this.pageIndex + 1,
            "perPage":  this.pageSize,
            "status":this.filterStatus,
            "plateform_type":this.filter

        }
        this._ordersService.getOrders(payload).subscribe(responce=>{
            if (responce['success']) {
                this.orders = responce['payload'].orders
                ;
                console.log("campaign",this.orders);
                
            }

        })   
        window.scrollTo(0,0)

    }

    instaOrders
    filter='1'
    filterValue(event){
        console.log("event",event);
this.filter= event
if(event==='2'){
      let payload={
            "plateform_type":event,
            "page":'1',
            "perPage":10,
            "status":this.filterStatus
        }
        
       
        // Get the data
        this._ordersService.getOrders(payload).subscribe((data) => {
            this.instaOrders = data['payload'].orders;
            // this.orders = data['payload'].orders

            this.ordersCount = data['payload'].totalCount;
            // // this.data = data;
            // // Execute the observable
            // this.totalChannels.next(this.channels.length);
            this._changeDetectorRef.markForCheck();
        });
} else{
        let payload={
            "plateform_type":event,
            "page":'1',
            "perPage":10,
        }
        
       
        // // Get the data
        this._ordersService.getOrders(payload).subscribe((data) => {
            // this.instaOrders = data['payload'];
            this.orders = data['payload'].orders

            this.ordersCount = data['payload'].totalCount;
            // // this.data = data;
            // // Execute the observable
            // this.totalChannels.next(this.channels.length);
            this._changeDetectorRef.markForCheck();
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    showText(item: Campaign) {
        this.orders$.subscribe((orders: Order[]) => {
            orders.forEach(order => {
                if (order.campaign.id === item.id) {
                    order.campaign['isReadMore'] = !order.campaign['isReadMore'];
                }
            });
        })
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

    countStatusItems(array, property) {
        return array.filter(x => x.status === property).length;
    }

    onViewClick(order: Order): void {
        this._router.navigate(['./', order.id], { relativeTo: this._activatedRoute });
    }

    onTabChanged(event: any) {
        this.selectedTabIndex = event.index;
        this.index=event.index
        this.currentPage=0
        console.log("event",event);
        
        let payload = {
            "status": event.index === 0 ? 0 : event.index === 1 ? 2 : event.index === 2 ? 1 : 0,
            "perPage": this.pageSize,
            "page": this.pageIndex ,
            "plateform_type":this.filter
            // "limit": "",
            // "offset": ""
        }
        this._ordersService.getOrders(payload).subscribe((data) => {
            this._changeDetectorRef.markForCheck();
        });
    }
}
