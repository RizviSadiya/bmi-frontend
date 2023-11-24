import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { ListService } from 'app/modules/admin/apps/list/list.service';
import { NotificationService } from 'app/core/services/notification.service';

@Component({
    selector: 'list-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListDetailsComponent implements OnInit, OnDestroy {
    note$: Observable<any>;
    list: any;
    listname: any;
    errorMsg: string = null;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private _data: { list: any },
        private _listService: ListService,
        private _matDialogRef: MatDialogRef<ListDetailsComponent>,
        private _notifyService: NotificationService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
     plateform_type:any='1'
    ngOnInit(): void {
        this.list = this._data.list;
        console.log(this.list)
    }

    plateform(any){
this.plateform_type=any
console.log("plateform_type",this.plateform_type);

    }


    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    selectPlateForm(event){
        console.log("event",event);
        console.log("plateform_type",this.plateform_type);
        let val = this.plateform_type
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    createListName(){

       let obj={
        "name":this.listname,
        "plateform_type":this.plateform_type
        }
        this._listService.createList(obj).subscribe(res=>{
            if(res.success){
                this._notifyService.showSuccess(res.message,"")
                this._matDialogRef.close(res.payload);
                // window.location.reload()
            }else{
                this._notifyService.showError(res.message,"")
            }
            
        })
        console.log("obj",obj);


    }
    onListNameChange() {
        console.log("listname",this.listname.length);
        
        // if (this.list.name.length > 0) {
        //     this.errorMsg = null;
        // }
        if (this.listname.length > 25) {
            // this.errorMsg = null;
            this.errorMsg = "Max length should be 25 characters";

        }
        if (this.listname.length === 25) {
            this.errorMsg = null;
            // this.errorMsg = "Max length should be 25 characters";

        }
        // if (this.list.name.length === 0 || this.list.name.length > 25) {
        //     this.errorMsg = "Max length should be 25 characters";
        // }
       
    }

    /**
     * Update the list name
     *
     * @param list
     */
    updateListName(): void {
        this.errorMsg = null;
        if (this.list.name) {
            if (this.list.name.length === 0 || this.list.name.length > 25) {
                this.errorMsg = "Max length should be 25";
                return;
            }
            let payload = {
                id: this.list.id,
                name: this.list.name
            }
            this._listService.updateList(payload).subscribe((updated) => {
                console.log(updated);
                if (updated.success) {
                    this._notifyService.showSuccess("", updated.message);
                    this._matDialogRef.close(updated.payload);
                } else {
                    return;
                }
            });
        } else {
            this.errorMsg = "List name cannot be empty";
        }
    }

    /**
     * Delete the given list
     *
     * @param list
     */
    deleteList(list: any): void {
        this._listService.deleteList(list)
            .subscribe((isDeleted) => {
                if (isDeleted.success) {
                    this._notifyService.showSuccess("", isDeleted.message);
                    list = { ...list, status: "0" };
                    this._matDialogRef.close(list);
                } else {
                    return;
                }
            });
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
