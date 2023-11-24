import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';

import { BmiMediaWatcherService } from '@bmi/services/media-watcher';
import { Application } from 'app/modules/admin/apps/applications/applications.types';
import { ApplicationsService } from 'app/modules/admin/apps/applications/applications.service';
import { Campaign } from 'app/modules/admin/apps/campaigns/campaigns.types';

import { HttpClient } from '@angular/common/http';
import { CampaignsService } from '../../campaigns/campaigns.service';
import { NavigationService } from 'app/core/navigation/navigation.service';
@Component({
    selector: 'applications-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationsListComponent implements OnInit, OnDestroy {
    @ViewChild('applicationDrawer', { static: true }) applicationDrawer: MatDrawer;
    pagination=true
    applications$: Observable<Application[]>;
    currentPage = 0;
    pageSize = 10;
    applicationsCount: number = 0;
    pendingCount: number = 0;
    rejectedCount: number = 0;
    completedCount: number = 0;
    shortlistCount: number = 0;
    contactsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
    drawerMode: 'side' | 'over';
    searchInputControl: FormControl = new FormControl();
    selectedCampaign: Application;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    selectedTabIndex: number = 0;
    selectedTabValue: string = "All";

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _applicationsService: ApplicationsService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: BmiMediaWatcherService,
        private httpClient: HttpClient,
        private _campaignsService: CampaignsService,
        private _navigationService: NavigationService,
    ) {

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        let url = window.location.href
        console.log("url", url);

        // Get the camapigns
        this.applications$ = this._applicationsService.applications$;
        this.applications$.subscribe(item => {
            console.log(item);

        });
        // let payload = {
        //     "page": this.pageIndex,
        //     "perPage": this.pageSize
        // }
        // this._navigationService.getApplications(payload).subscribe(res => {
        //     if (res) {
        //         console.log("res", res);

        //     }
        // })

        this._applicationsService.totalApplications$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.applicationsCount = count;
                console.log("application list component...");
                this._changeDetectorRef.markForCheck();
            });
        this._applicationsService.pendingApplications$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.pendingCount = count;
                this._changeDetectorRef.markForCheck();
            });
        this._applicationsService.rejectedApplications$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.rejectedCount = count;
                this._changeDetectorRef.markForCheck();
            });
        this._applicationsService.completedApplications$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.completedCount = count;
                this._changeDetectorRef.markForCheck();
            });
        this._applicationsService.ShortlistedApplications$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.shortlistCount = count;
                this._changeDetectorRef.markForCheck();
            });

        // Get the campaign
        this._applicationsService.application$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((application: Application) => {

                // Update the selected campaign
                this.selectedCampaign = application;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap(query =>

                    // Search
                    this._applicationsService.searchApplications(query)
                )
            )
            .subscribe();

        // Subscribe to applicationDrawer opened change
        this.applicationDrawer.openedChange.subscribe((opened) => {
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

    }
    //for navigate to campaing
    nextStateRoute: string = null;
    navigateToNextStep() {
        let nextState = this.nextStateRoute ? this.nextStateRoute : '/apps/campaigns/all';
        this._router.navigate([nextState]);
    }

    filterValue(event){
        this.filter=event
        if(this.filter==='2'){
            let payload = {
                // "limit": this.pageSize,
                "page": this.pageIndex + 1,
                "perPage": this.pageSize,
                "status":this.filterStatus,
                "plateform_type":this.filter
            }
            this._applicationsService.getApplications(payload).subscribe(responce => {
                if (responce['success']) {
                    this.applications = responce['payload'].applications
                        ;
                    console.log("campaign", this.applications);
    
                }
    
            })
        }else{
            let payload = {
                // "limit": this.pageSize,
                "page": this.pageIndex + 1,
                "perPage": this.pageSize,
                "status":this.filterStatus,
                "plateform_type":this.filter
            }
            this._applicationsService.getApplications(payload).subscribe(responce => {
                if (responce['success']) {
                    this.applications = responce['payload'].applications
                        ;
                    console.log("campaign", this.applications);
    
                }
    
            })
        }
    }

index=0
filterStatus:any
filter:any='1'
    onChangePage(event) {
        console.log("event", event);

        this.pageIndex = event.pageIndex;
        this.currentPage = event.pageIndex;
        this.pageSize = event.pageSize
        if(this.index===0){
            this.filterStatus=''
        this.getapplicationlistFromServer();

        }
        if(this.index===1){
            this.filterStatus='0'
        this.getapplicationlistFromServer();

        }
        if(this.index===2){
            this.filterStatus='2'
        this.getapplicationlistFromServer();

        }

    }

    scroll(el:HTMLElement) {
      el.scrollIntoView({behavior:'smooth'})
    }

    
    applications: any;
    channels;
    pageIndex: number = 0;
   
    getapplicationlistFromServer() {
        console.log("pageIndex",this.pageIndex);
        
        let payload = {
            // "limit": this.pageSize,
            "page": this.pageIndex + 1,
            "perPage": this.pageSize,
            "status":this.filterStatus,
            "plateform_type":this.filter
        }
        this._applicationsService.getApplications(payload).subscribe(responce => {
            if (responce['success']) {
                this.applications = responce['payload'].applications
                    ;
                console.log("campaign", this.applications);

            }

        })
        window.scrollTo(0, 0)

    }

    getList() {
        // this._applicationsService.getApplications().subscribe((data) => {

        //     this._changeDetectorRef.markForCheck();
        // });
        // Get the campaign
        this._applicationsService.application$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((application: Application) => {

                // Update the selected campaign
                this.selectedCampaign = application;

                // Mark for check
                this._changeDetectorRef.markForCheck();
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
     * On backdrop clicked
     */
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    showText(item: Campaign) {
        this.applications$.subscribe((applications: Application[]) => {
            applications.forEach(application => {
                if (application.campaign.id === item.id) {
                    application.campaign['isReadMore'] = !application.campaign['isReadMore'];
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

    onApplyClick(application: Application): void {
        this._applicationsService.isPreviewMode(false);
this._applicationsService.setPlateform(application)
this._campaignsService.setPlateForm(application)

        this._router.navigate(['./', application.id], { relativeTo: this._activatedRoute });
    }

    onViewClick(application: Application): void {
        this._applicationsService.isPreviewMode(true);
this._applicationsService.setPlateform(application)

// this._router.navigate([])
        // this._router.navigate(['/apps/campaigns/preview']);

        this._router.navigate(['./', application.id], { relativeTo: this._activatedRoute });
    }

    onpreViewClick(application: Application): void {
        console.log("application",application);

        this._applicationsService.isPreviewMode(true);
        this._router.navigate(['./', application.id], { relativeTo: this._activatedRoute });
    }

    onDeleteClick(application: Application): void {
        console.log("funtionncal")

    }

    onTabChanged(event: any) {
        this.selectedTabIndex = event.index;
        this.index = event.index;
        this.selectedTabValue = event.tab.textLabel.split(" ")[0];
        this.currentPage=0
        let payload = {
            "status": event.index === 0 ? "" : event.index === 1 ? "0" : event.index === 2 ? "2" : event.index === 3 ? "5" : "0",
            "perPage": "10",
            "page": "1",
            "plateform_type":this.filter
            // "limit": "",
            // "offset": ""
        }
        this._applicationsService.getApplications(payload).subscribe((data) => {
            this._changeDetectorRef.markForCheck();
        });
    }
}
