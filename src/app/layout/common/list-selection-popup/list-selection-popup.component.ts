import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { NotificationService } from 'app/core/services/notification.service';
import { DashboardService } from 'app/modules/admin/dashboard/dashboard.service';
import { AppConstant } from 'app/app.constants';

@Component({
    selector: 'list-selection-popup',
    templateUrl: './list-selection-popup.component.html',
    styleUrls: ['./list-selection-popup.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListSelectionPopupComponent implements OnInit, OnDestroy {
    listForm: FormGroup;
    createForm: FormGroup;
    submitted: boolean = false;
    preferences: string[];
    userLists = [];
    channelName: string = "";
    createNew: boolean = false;
    listError: string = null;

    constructor(
        private _formBuilder: FormBuilder,
        private _matDialogRef: MatDialogRef<ListSelectionPopupComponent>,
        private _dashboardService: DashboardService,
        private _notifyService: NotificationService,
        @Inject(MAT_DIALOG_DATA) private _data: { userLists: any, channelId: any, channelName: string ,platform_type:any}
    ) { }

    ngOnInit(): void {
        console.log("this._data",this._data);
        
        this.userLists = this._data.userLists;
        // this.userLists = this._data.userLists.filter((list: any) => list.list_data.find((channel: any) => channel.channel_id !== this._data.channelId));
        this.channelName = this._data.channelName;

        this.listForm = this._formBuilder.group({
            listId: this._formBuilder.array([], [Validators.required])
        });

        let matchedChannel = this._data?.userLists.filter((list: any) => list?.list_data?.find((channel: any) => channel.channel_id === this._data.channelId));
        if (matchedChannel.length > 0) {
            const lists: FormArray = this.listForm.get('listId') as FormArray;
            matchedChannel.forEach(item => {
                lists.push(new FormControl(item.id));
            })
        }
        let platform 
        if(this._data.platform_type==='1'){
            platform ='youtube'
        }else{
            platform ='instagram'

        }

    

        this.createForm = this._formBuilder.group({
            name: ['', [Validators.required, Validators.pattern(AppConstant.REGEX.LIST_REF)]],
            "plateform_type" : [this._data.platform_type]
        });
    }

    onSelectionChange(e) {
        const lists: FormArray = this.listForm.get('listId') as FormArray;

        if (e.target.checked) {
            lists.push(new FormControl(e.target.value));
        } else {
            let i: number = 0;
            lists.controls.forEach((item: FormControl) => {
                if (item.value == e.target.value) {
                    lists.removeAt(i);
                    return;
                }
                i++;
            });
        }
    }

    proceed(): void {
        this.listError = null;
        this.submitted = true;
        if (this.listForm.invalid) {
            this.listError = "Please select at least one value";
            return;
        }

        let payload = {
            "list_id": this.listForm.value.listId.toString(),
            "channel_id": this._data.channelId
        }

        this._dashboardService.addChannelToList(payload).subscribe(data => {
            if (data.success) {
                this._matDialogRef.close(true);
                this._notifyService.showSuccess(data.message, "");
            }
        });
    }

    createNewList() {
        this.createNew = !this.createNew;
    }

    createAndAdd() {
        if (this.createForm.invalid) {
            return;
        }
        this._dashboardService.createList(this.createForm.getRawValue()).subscribe(data => {
            if (data.success) {
                let payload = {
                    "list_id": data.payload.id,
                    "channel_id": this._data.channelId,
                    "plateform_type": this._data.platform_type
                }

                this._dashboardService.addChannelToList(payload).subscribe(result => {
                    if (result.success) {
                        this._notifyService.showSuccess(result.message, "");
                        this._matDialogRef.close(true);
                    }
                });
            }
        });
    }

    checkIfSelected(item) {
        let channelFound = item.filter((list: any) => list.channel && list.channel.title === this.channelName);
        return channelFound.length > 0;
    }

    ngOnDestroy(): void {

    }
}