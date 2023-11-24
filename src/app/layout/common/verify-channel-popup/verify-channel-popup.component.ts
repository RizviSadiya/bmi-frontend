import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';

import { DashboardService } from 'app/modules/admin/dashboard/dashboard.service';
import { UserService } from 'app/core/user/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { NotificationService } from 'app/core/services/notification.service'; 
@Component({
    selector: 'verify-channel-popup',
    templateUrl: './verify-channel-popup.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyChannelPopupComponent implements OnInit {
    channel: any;
    errorMessage: string = null;
    copiedBmi: boolean = false;
    copiedProfile: boolean=false;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private clipboard: Clipboard,
        private _dashboardService: DashboardService,
        private _userService: UserService,
        private _authService: AuthService,
        private _notifyService: NotificationService,

        private _matDialogRef: MatDialogRef<VerifyChannelPopupComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: { channel: any }
    ) { }
link:any
    ngOnInit(): void {
        let userEmail= this._userService.userDetails
        console.log("userEmail",userEmail);
        
        this.channel = this._data.channel;
        console.log("Verify Your Channel",this.channel)
        
//         if(!this.channel.influ_id){
//             this.channel.influ_id=2
//             this.link=this.channel.influ_id +"/"+this.channel.canonical_name
//         }else{
this.link=userEmail.id +"/"+this.channel.canonical_name

//         }
// this.link=this.channel.id +"/"+this.channel.canonical_name
// this.link=this.channel.influ_id +"/"+this.channel.canonical_name
console.log("this.link",this.link)
    }

    copyBmiText(textToCopy: string) {
        this.clipboard.copy(textToCopy);
        let me = this;
        me.copiedBmi = true;
        setTimeout(() => {
            me.copiedBmi = false;
            me._changeDetectorRef.markForCheck();
        }, 3000);
    }

    copyProfileUrlText(textToCopy: string) {
        console.log("textToCopy",textToCopy);
        
        this.clipboard.copy(textToCopy);
        let me = this;
        me.copiedProfile = true;
        setTimeout(() => {
            me.copiedProfile = false;
            me._changeDetectorRef.markForCheck();
        }, 3000);
    }

    verifyChannel(): void {
        this._dashboardService.verifyChannel({ "channel_id": this.channel.canonical_name }).subscribe(data => {
            if (data.success) {
                this._matDialogRef.close(data);
                this._notifyService.showSuccess(data.message,"success")
            } else {
                this.errorMessage = "Verification failed. Link not found in your channel's about section. Please try again.";
            }
        });
    }
    instaVerifyChannel(): void {
        this._dashboardService.verifyChannel({ "channel_id": this.channel.username }).subscribe(data => {
            if (data.success) {
                this._matDialogRef.close(data);
            } else {
                this.errorMessage = "Verification failed. Link not found in your channel's about section. Please try again.";
            }
        });
    }
}