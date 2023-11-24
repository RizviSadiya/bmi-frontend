import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationStart } from '@angular/router';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { BmiMediaWatcherService } from '@bmi/services/media-watcher';
import { BmiNavigationService, BmiVerticalNavigationComponent } from '@bmi/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { UserService } from 'app/core/user/user.service';
import { QuickChatService } from 'app/layout/common/quick-chat/quick-chat.service';
import { CreditTopupComponent } from 'app/layout/common/credit-topup/credit-topup.component';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Application } from 'app/modules/admin/apps/applications/applications.types';
import { CampaignsService } from 'app/modules/admin/apps/campaigns/campaigns.service';
import { ApplicationsService } from 'app/modules/admin/apps/applications/applications.service'
import { BmiConfirmationService } from '@bmi/services/confirmation';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';
@Component({
    selector: 'vertical-layout',
    templateUrl: './vertical.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerticalLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;
    navigation: Navigation;
    oldNavigation: Navigation;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    oldUserType: string = "INFLUENCER";
    userType: string = "INFLUENCER";
    menuItems: any;
    publicProfileScreen: boolean;
    whatsappRequestForm:FormGroup
    /**
     * Constructor
     */
     private _applications: BehaviorSubject<Application[] | null> = new BehaviorSubject(null);

    constructor(
        private _changeDetector: ChangeDetectorRef,
        private _matDialog: MatDialog,
        private _router: Router,
        private _navigationService: NavigationService,
        private _campaignsService: CampaignsService,
        private _applicationsService: ApplicationsService,
        private _userService: UserService,
        private _bmiMediaWatcherService: BmiMediaWatcherService,
        private _bmiNavigationService: BmiNavigationService,
        private _bmiConfirmationService: BmiConfirmationService,
        private _formBuilder: FormBuilder,
        private clipboard: Clipboard,
        private _quickChatService: QuickChatService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
     get applications$(): Observable<Application[]> {
        return this._applications.asObservable();
    }

    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    userCredit:any
    plateform:any
    ngOnInit(): void {
        this.oldUserType = this._userService.userDetails.userType.toUpperCase();
        this.userCredit = this._userService.userDetails
        console.log("userCredit",this.userCredit.uuid);
        // console.log("oldUserType",this.oldUserType);
       this.plateform=this._applicationsService.getPlateform()
        // Subscribe to navigation data
        this.updateMenuNavigation();
        this._quickChatService.getChats()

        this._navigationService.channelRevealed$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((value: boolean) => {
                if (value) {
                    this.updateMenuNavigation(); 
                    this._bmiNavigationService.menuRefresh(true);
                }
            });

        // Subscribe to media changes
        this._bmiMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });

        this._router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                console.log(event.url);
                // this._router.navigate([event.url])
                // window.location.reload()
                let payload={
                    "page":'1',
                    "perPage":'10',
                    "status":'',
                    'plateform_type':this.plateform?.plateform_type
                }
                if(event.url=='/apps/applications'){
                   
                    // this._applicationsService.getApplications(payload).subscribe(applications=>{
                    //     this._applications.next(applications["payload"].applications);
                    //     // window.location.reload()
                    // })
                    
                }else{
                    // this._campaignsService.getCampaigns(payload).subscribe(applications=>{
                    //     this._applications.next(applications["payload"].applications);
                    //     // window.location.reload()
                    // })
                }
              
                this._quickChatService.toggleChat(false);
                if (event.url.indexOf('youtube') > -1) {
                    this.publicProfileScreen = true;
                    this._changeDetector.markForCheck();
                }
            }
        });

        if (this._router.url.indexOf('youtube') > -1) {
            this.publicProfileScreen = true;
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

    updateMenuNavigation() {
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => { 
                this.oldNavigation = navigation[this.oldUserType.toLowerCase()];
                this._navigationService.getMenucount().subscribe(data => {
                    if (data && data.payload) {
                        this.menuItems = data.payload;
                        this.userCredit = data.payload;
                        this.userType = this.menuItems.user_type.toUpperCase();
                        localStorage.setItem('default_channel', data.payload.default_channel);
                        this._userService.updateUserDetailsInLocalStorage("plan_id", data.payload.plan_id);
                        this._userService.updateUserDetailsInLocalStorage("wallet_balance", data.payload.totalWallet);
                        // update userType
                        if (this.menuItems.user_type) {
                            this._userService.updateUserDetailsInLocalStorage("userType", this.menuItems.user_type);
                        }
                        // If no plan is selected by brand
                        if (this.menuItems.user_type === 'brand' && !this.menuItems.plan_id) {
                            this._router.navigateByUrl('/choose-plan');
                        }
                        if (this.menuItems.user_type === 'brand' && this.menuItems.totalCredit < 50) {
                            // this._router.navigateByUrl('/choose-plan');
                            // this.updateTopup()
                        }
                        let children = navigation[this.userType.toLowerCase()][0].children;
                        for (let i = 0; i < children.length; i++) {
                            switch (children[i].title.toLowerCase()) {
                                case "campaigns":
                                    let campaignCount = data.payload.campaign;
                                    navigation = this.updateMenuItem(navigation, i, campaignCount);
                                    break;
                                case "proposals":
                                    let proposalCount = data.payload.applicationsCount;
                                    navigation = this.updateMenuItem(navigation, i, proposalCount);
                                    break;
                                case "orders":
                                    let orderCount = data.payload.orderCount;
                                    navigation = this.updateMenuItem(navigation, i, orderCount);
                                    break;
                                case "inbox":
                                    let inboxCount = data.payload.InboxCount;
                                    navigation = this.updateMenuItem(navigation, i, inboxCount);
                                    break;
                                case "invitation":
                                    let invitationCount = data.payload.invitation;
                                    navigation = this.updateMenuItem(navigation, i, invitationCount);
                                    break;
                                case "revealed channels":
                                    let revealedChannels = data.payload.revealedChannels;
                                    navigation = this.updateMenuItem(navigation, i, revealedChannels);
                                    break;
                                case "favourite channels":
                                    let savedChannelsCount = data.payload.savedChannelsCount;
                                    navigation = this.updateMenuItem(navigation, i, savedChannelsCount);                                    
                                    break;
                                default:
                                    // do nothing
                            }
                            
                           
                            if (children[i].id.toLowerCase() === "dashboards.profile") {
                                // this.clipboard.copy( );
                                navigation[this.userType.toLowerCase()][0].children[i].link = "/pages/profile/" + data.payload.default_channel + "/" + data.payload.uuid;
                              
                            }
                        }
                    }
                    this.navigation = navigation[this.userType.toLowerCase()];
                    this._changeDetector.markForCheck();
                });
            });
        this._navigationService.updateLeftMenuItem(false);
    }

    updateTopup(){
        this.whatsappRequestForm = this._formBuilder.group({
            title: 'Credit Topup',
            message: 'Your credits balance is low buying more credits? ',
            icon: this._formBuilder.group({
                show: false,
                name: 'heroicons_solid:whatsapp',
                color: 'warn'
                // data:"ph:whatsapp-logo",
                // material:'WhatsApp',
 
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

        // Open the dialog and save the reference of it
        const dialogRef = this._bmiConfirmationService.open(this.whatsappRequestForm.value);

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result === "confirmed") {
            this.topUp()
            //     let obj={
            //         "channel_id":this.channel.channel_id
            //     }
            //   this._campaignService.sendWhatsappRequest(obj).subscribe(res=>{
            //     if(res.success){
            //         this._notifyService.showSuccess(res.message,"")
            //     }
            //     else{
            //         this._notifyService.showError(res.message ,"error")
            //     }
            //   })
            }
        });
      
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation

        const navigation = this._bmiNavigationService.getComponent<BmiVerticalNavigationComponent>(name);
console.log("navigation",navigation)
        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
          
        }
    }

    openChat(){
        alert
        ("hello")
        this._quickChatService.getChats()

    }

    updateMenuItem(navigation: Navigation, index: number, menuCount) {
        if (menuCount > 0) {
            if (navigation[this.userType.toLowerCase()][0].children[index].badge) {
                navigation[this.userType.toLowerCase()][0].children[index].badge.title = menuCount + "";
            } else {
                navigation[this.userType.toLowerCase()][0].children[index] =
                {
                    ...navigation[this.userType.toLowerCase()][0].children[index],
                    badge: { title: menuCount + "", classes: "px-2 bg-orange-600 text-white rounded-full" }
                };
            }
        } else {
            delete (navigation[this.userType.toLowerCase()][0].children[index].badge);
        }
        return navigation;
    }

    topUp() {
        this._matDialog.open(CreditTopupComponent, {
            autoFocus: false
        });
    }
}
