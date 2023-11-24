import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash-es';

import { ListService } from 'app/modules/admin/apps/list/list.service';
import { ListDetailsComponent } from './details/details.component';
import { NotificationService } from 'app/core/services/notification.service';
import { ViewlistDetailComponent } from '../viewlist-detail/viewlist-detail.component';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { DashboardService } from '../../dashboard/dashboard.service';
import { BmiConfirmationService } from '@bmi/services/confirmation';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RevealedChannelsService } from '../revealed-channels/revealed-channels.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { InviteInfluencerPopupComponent } from 'app/layout/common/invite-influencer-popup/invite-influencer-popup.component';

@Component({
    selector: 'bmi-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit, OnDestroy {
    lists$: Observable<any[]>;
    totalLists: number = 0;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    removeproposalForm:FormGroup

    /**
     * Constructor
     */
    constructor(
        private _listService: ListService,
        private _userService: UserService,
        private _revealService: RevealedChannelsService,
        private _dashboardService:DashboardService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _bmiConfirmationService: BmiConfirmationService,
        private _campaignService: CampaignsService,

        private _notifyService: NotificationService,
        private route:Router
    ) {
    }

    listArray:any
    reveal:any
    ngOnInit(): void {
        this.lists$ = this._listService.lists$;       
        this._listService.totalLists$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((count: number) => {
                this.totalLists = count;
                this._changeDetectorRef.markForCheck();
            });
    }
pageSize=10;
currentPage=0
    onChangePage(event){
        console.log("event",event);
        
        this.pageIndex = event.pageIndex;
        this.getMylistFromServer();
        this.currentPage = event.pageIndex;
        this.pageSize = event.pageSize
    }

    lists:any
    pageIndex: number = 0;
    paginator=false
    getMylistFromServer() {
      
        let payload = {
            // "limit": this.pageSize,
            "page": this.pageIndex + 1,
            "perPage":  this.pageSize

        }
        // this._campaignService.getCampaigns(payload).subscribe();

        this._listService.getLists(payload).subscribe(responce=>{
            if (responce['success']) {
                this.lists = responce['payload'].list                ;
                console.log("list",this.lists);
            
                
            }

        })   
        window.scrollTo(0,0)

    }


  

    addList(){
        // const dialogRef= this._matDialog.open(AddMoneyPopupComponent, {
        //     autoFocus: false,
        //     data: {
        //       amount: payableAmount,
        //       page: "reviewVideo"
        //     }
        //   }); 
        //   dialogRef.afterClosed().subscribe(result => {
        //     console.log('The dialog was closed');
        //     window.location.reload();
        //   });
          
    }

      /**
     * Delete the given list
     *
     * @param list
     */
    //    deleteList(list: any): void {
    //     // alert('delete')
    //     this._listService.deleteList(list)
    //         .subscribe((isDeleted) => {
    //             if (isDeleted.success) {
    //                 this._notifyService.showSuccess("", isDeleted.message);
    //                 list = { ...list, status: "0" };
    //                 // this._matDialog.close(list);
    //                 window.location.reload()
    //             } else {
    //                 return;
    //             }
    //         });
    // }

    deleteList(list: any): void {
        this.removeproposalForm = this._formBuilder.group({
            title: 'Are you sure you want to delete this list?',
            message: '',
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

        // Open the dialog and save the reference of it
        const dialogRef = this._bmiConfirmationService.open(this.removeproposalForm.value);

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result === "confirmed") {
            
                this._listService.deleteList(list)
            .subscribe((isDeleted) => {
                if (isDeleted.success) {
                    this._notifyService.showSuccess("", isDeleted.message);
                    list = { ...list, status: "0" };
                    // this._matDialog.close(list);
                    // window.location.reload()
        this.getMylistFromServer();
                    
                } else {
                    return;
                }
            });
            }
        }); 
    }

    campaigns:any
    inviteAll() {
        let payload = {
            "status": "1",
            "perPage": "10",
            "page": "1"
            // "limit": "",
            // "offset": ""
        };
        this._campaignService.getCampaigns(payload).subscribe(data => {
            this.campaigns = data['payload'].campaign;
            this.openInvitationPopup('All');

        });
    }


    openInvitationPopup(channel) {
        const inviteChannelPopup = this._matDialog.open(InviteInfluencerPopupComponent, {
            maxHeight: '95vh',
            maxWidth: '80vw',
            autoFocus: true,
            disableClose: true,
            data: {
                channelName: 'All',
                channelId: 'All',
                campaigns: this.campaigns,
                channel:  channel,
                revealedChannel:  this.lists,
            }
        });

        inviteChannelPopup.afterClosed().subscribe(res => {
            console.log(res);

        });

    }

    viewChannelList(list){
        let listData
        let payload={
            "id":list.id,
            "page":this.pageIndex+1,
            "perPage":'10'
        }
       this._listService.getViewListsDetails(payload).subscribe((res:any[])=>{
        listData=res['payload']
        console.log("listData",listData);
        // this.route.navigate(['pages/revealed-channels'])
        this._userService.setListData(listData)
        this._userService.setListname(list)
        localStorage.setItem('list_data', JSON.stringify(listData.channelList))
        this.route.navigate(['pages/lists/list-view'])

        // this.ViewCamDetails(listData)
       })
    }

    ViewCamDetails(listData){
       
        // this._userService.setListData(list)
        //     localStorage.setItem('list_data', JSON.stringify(list))
        // console.log("list",list);
        
        // this.route.navigate(['pages/veiwlistDetail'])
        const listDetails = this._matDialog.open(ViewlistDetailComponent, {
            autoFocus: false,
            data: {
                list: listData
                // list: cloneDeep(listData)
            }
        });

        listDetails.afterClosed().subscribe((result) => {
            if (result) {
                if (result.status == 1) {
                    this.lists$.forEach(list => {
                        list.forEach(item => {
                            if (item.id === result.id) {
                                item.name = result.name;
                            }
                        })
                    });
                    this._changeDetectorRef.markForCheck();
                } else if (result.status == 0) {
                    this.lists$.forEach(list => {
                        for (let i = 0; i < list.length; i++) {
                            if (list[i].id === result.id) {
                                list.splice(i, 1);
                                this.totalLists = this.totalLists - 1;
                            }
                        }
                    });
                };
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    openListDetails(list) {
        const listDetails = this._matDialog.open(ListDetailsComponent, {
            autoFocus: false,
            data: {
                list: cloneDeep(list)
            }
        });

        listDetails.afterClosed().subscribe((result) => {
            if (result) {
                if (result.status == 1) {
                    this.lists$.forEach(list => {
                        list.forEach(item => {
                            if (item.id === result.id) {
                                item.name = result.name;
                            }
                        })
                    });
                    this._changeDetectorRef.markForCheck();
                } else if (result.status == 0) {
                    this.lists$.forEach(list => {
                        for (let i = 0; i < list.length; i++) {
                            if (list[i].id === result.id) {
                                list.splice(i, 1);
                                this.totalLists = this.totalLists - 1;
                            }
                        }
                    });
                };
                this.getMylistFromServer()
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
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

    scroll(el: HTMLElement) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
}
