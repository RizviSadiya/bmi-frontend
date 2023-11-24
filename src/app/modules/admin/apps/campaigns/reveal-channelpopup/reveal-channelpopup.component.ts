import { JsonPipe } from '@angular/common';
import { Component, OnInit ,Inject, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BmiConfirmationService } from '@bmi/services/confirmation';
import { AuthService } from 'app/core/auth/auth.service';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { NotificationService } from 'app/core/services/notification.service';
import { UserService } from 'app/core/user/user.service';
import { CreditTopupComponent } from 'app/layout/common/credit-topup/credit-topup.component';
import { InfluencerChannelService } from 'app/layout/common/influencer-channel/influencer-channel.service';
// import { userInfo } from 'os';
import { DashboardService } from 'app/modules/admin/dashboard/dashboard.service';
@Component({
  selector: 'app-reveal-channelpopup',
  templateUrl: './reveal-channelpopup.component.html',
  styleUrls: ['./reveal-channelpopup.component.scss']
})
export class RevealChannelpopupComponent implements OnInit {
  publicForm:FormGroup
  addCreditOrUpgradeForm:FormGroup
  userPlan:any
  @Output() channelRevealed: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<RevealChannelpopupComponent>,
    private _formBuilder:FormBuilder,
    private _channelService: InfluencerChannelService,
    private _notifyService: NotificationService,
    private _navigationService: NavigationService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _bmiConfirmationService: BmiConfirmationService,
    private _router: Router,
    private _matDialog: MatDialog,
    private _userService: UserService,
    private _authService: AuthService,
    private dashboard: DashboardService,


    @Inject(MAT_DIALOG_DATA) public data,
  ) { }
  channel_id:any
creditCost:any
  ngOnInit(): void {
    console.log("data",this.data.data)
    console.log("data",this.data)
    this.channel_id =this.data.id
    console.log("channel_id",this.channel_id);
    
    this.channel_id =this.data.data.id

    console.log("filter",this.data.filter)
    this.userPlan = this._userService.userDetails;

    console.log("userPlan",this.userPlan)
// this.dashboard.getDashboardData().subscribe(res=>{
// this.creditCost = res.payload.totalCredit
//   console.log("dashboard",this.creditCost);
  
// })
  }

  upgradePlan(){
    console.log("upgread",this.userPlan);
    
    if(this.creditCost < this.data?.data?.credit_cost){
      this.askForTopupOrUpgrade()
    }else{

   
    let plateform_type=this.data.plateform_type
     plateform_type=this.data.filter

        let payload = {
                      "channel_id":this.channel_id,
                       "plateform_type":plateform_type
                  };
         
        this._channelService.revealChannel(payload).subscribe(data => {
          if(data.success){
            this._notifyService.showSuccess(data.message, '');
              console.log("data beforeif",data);
              
              // if (this.data.id === this.data.id) {
                 this.data.is_revealed = true;
                  this.data = data.payload.channel;
                  console.log("this.channel if",  this.data);
          this.dialogRef.close(data.payload.channel);
              this._changeDetectorRef.markForCheck();
              this.channelRevealed.next(true);
                  this._navigationService.updateLeftMenuItem(true);
                  
              // }
              
          //     this.channelRevealed.next(true);
          //     this._navigationService.updateLeftMenuItem(true);
          //     this._changeDetectorRef.markForCheck();
          // this.dialogRef.close(data.payload.channel);

          }
              
          },
          error => {
              if (error === "Credit blance is low") {
                  this.askForTopupOrUpgrade();
              }
          });
        }
  }

checkValue:any
  checkme(event,id){
    console.log("event",event.target.checked);
    if(event.target.checked===true){
      let checkValue=1
      let payload=
      { 
        "dont_show_me_again":checkValue
    }
      this._channelService.dontShowMeAgain(payload).subscribe(data => {
        // this.data.is_favourite = false;
        this.checkValue=data.payload
        // this._changeDetectorRef.markForCheck();
        // this._navigationService.updateLeftMenuItem(true);
console.log("dontShowMe",data);
localStorage.setItem("userInfo",JSON.stringify(data.payload) )
        // this._notifyService.showWarning(data.message, "Warning");
    });

   

    }else{
      this.checkValue =0
    }

  }

//   dontShowMe(id) {
//     let payload=
//     { 
//       "dont_show_me_again":this.checkValue
//   }
//     this._channelService.dontShowMeAgain(payload).subscribe(data => {
//         // this.data.is_favourite = false;

//         // this._changeDetectorRef.markForCheck();
//         // this._navigationService.updateLeftMenuItem(true);
// console.log("dontShowMe",data);

//         // this._notifyService.showWarning(data.message, "Warning");
//     });
// }

  
  askForTopupOrUpgrade() {
    this.addCreditOrUpgradeForm = this._formBuilder.group({
        title: 'Low Credit Balance',
        message: 'You\'re currently low on credits. Consider upgrading your plan or buying more credits.',
        icon: this._formBuilder.group({
            show: true,
            name: 'heroicons_outline:badge-check',
            color: 'warn'
        }),
        actions: this._formBuilder.group({
            confirm: this._formBuilder.group({
                show: true,
                label: 'Upgrade Plan',
                color: 'primary'
            }),
            cancel: this._formBuilder.group({
                show: true,
                label: 'Buy Credits',
                color: 'warn'
            })
        }),
        dismissible: true
    });

    // Open the dialog and save the reference of it
    const dialogRef = this._bmiConfirmationService.open(this.addCreditOrUpgradeForm.value);
    dialogRef.afterClosed().subscribe((result) => {
        if (result === "confirmed") {
            this._router.navigateByUrl('/choose-plan');
        } else if (result === "cancelled") {
            this._matDialog.open(CreditTopupComponent, {
                autoFocus: false
            });
        }
    });
}
}
