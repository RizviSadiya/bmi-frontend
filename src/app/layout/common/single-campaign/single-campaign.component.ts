import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { BmiConfirmationService } from '@bmi/services/confirmation';
import { Campaign } from 'app/modules/admin/apps/campaigns/campaigns.types';
import { UserService } from 'app/core/user/user.service';
import { CampaignsService } from 'app/modules/admin/apps/campaigns/campaigns.service';
import { InviteCampaignPopupComponent } from '../invite-campaign-popup/invite-campaign-popup.component';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'app/core/auth/auth.service';
import { RevealedChannelsComponent } from 'app/modules/admin/apps/revealed-channels/revealed-channels.component';
import { Router } from '@angular/router';
import { CreditTopupComponent } from '../credit-topup/credit-topup.component';
import { ProposalHostoryComponent } from 'app/modules/admin/apps/campaigns/proposal-hostory/proposal-hostory.component';

@Component({
    selector: 'single-campaign',
    templateUrl: './single-campaign.component.html',
    styleUrls: ['./single-campaign.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class singleCampaignComponent implements OnInit, OnDestroy {
    @Input() campaign: Campaign;
    @Input() plateform: any;
    @Input() rejectedCount: any;
    @Input() draftCount: any;
    @Input() reviewMode: boolean;
    @Input() bidAmount: string;
    @Input() application: any;
    @Input() status: string;
    @Input() mode: string;
    @Input() createdAt: string;
    @Output() applyClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() editClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() previwClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() viewClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() responseClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() previewClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() getList = new EventEmitter();

    userType: string = "";
    removeproposalForm: any;
    userDetails: any;
    test:any;
    Promotype:any
    

    constructor(
        private _userService: UserService,
        private _sanitizer: DomSanitizer,   
        private _bmiConfirmationService: BmiConfirmationService,
        private _campaignService: CampaignsService,
        private _matDialog: MatDialog,
        private toaster: ToastrService,
        private _formBuilder: FormBuilder,
        private AuthService: AuthService,
        private _router:Router
    ) { }

    ngOnInit(): void {
        console.log("campaigntest",this.campaign);
        console.log("application",this.application);
            this._campaignService.setHirecampaignData(this.campaign);
            this.Promotype= this._campaignService.gettestData();
            console.log("Promotypenew",this.Promotype);
            console.log("plateform",this.plateform);


        
        this.userType = this._userService.userDetails.userType.toUpperCase();
        this.userDetails = this._userService.userDetails
        // console.log("userDetails",this.userDetails);
        
        if(this.campaign){
            this.campaign.isReadMore = true;

        }
        
    }

    // inviteChannel(campaign){
    //     this._router.navigate(['/pages/suggested-channels'])
    //             // campaigns:campaign,
    //             this._userService.setinviteList(campaign)

    // }

    deleteproposal() {
        this.removeproposalForm = this._formBuilder.group({
            title: 'Are you sure you want to delete this proposal?',
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
            let payload ={
                "id":this.application.id,
                "platform":this.plateform
            }
                this._campaignService.DeleteProposal(payload).subscribe(res=>{
                    if(res.code==200){
                       this.toaster.success(res.message)
                        this.getList.emit()
                        window.location.reload()
                    console.log("this.getList",this.getList.emit())
                    }
                    else{
                      this.toaster.error(res.message)
                    }
                })
            }
        });
    }

    // deleteproposal(){
    //     console.log( " this.application",this.application);
      

    //             this._campaignService.DeleteProposal(this.application.id).subscribe(res=>{
    //                 if(res.code==200){
    //                    this.toaster.success(res.message)
    //                     this.getList.emit()
    //                     window.location.reload()
    //                 console.log("this.getList",this.getList.emit())
    //                 }
    //                 else{
    //                   this.toaster.error(res.message)
    //                 }
    //             })
    // }

    showText(item: Campaign) {
        this.campaign.isReadMore = !this.campaign.isReadMore;
    }

    onApplyClick() {
        this.applyClicked.next(true);
       this._userService.setData(this.campaign)
       sessionStorage.setItem('campDetails',JSON.stringify(this.campaign))
       localStorage.setItem('campDetails', JSON.stringify(this.campaign))
    }

    inviteList(campaign){
        
        this._campaignService.setSimilardata(campaign)
        localStorage.setItem('category', JSON.stringify(campaign));

        this._router.navigate(['/pages/suggested-channels'])
    }

    onResponsesClick(campaign) {
        this._campaignService.setPlateForm(campaign)

        this.responseClicked.next(true);
    }

    onEditClick() {
        this.editClicked.next(true);
    }
    onPreviewClick() {
     
        this.previewClicked.next(true);
    }

    proposalHistory(campaign) {
     
        this._matDialog.open(ProposalHostoryComponent, {
            autoFocus: false,
            data:campaign
        });
    }

    deleteCampaignClick(){
        this.removeproposalForm = this._formBuilder.group({
            title: 'Remove Campaign',
            message: 'Do you want to close your campaign to new proposals?',
            // message: 'Are you sure you want to  delete this Campaign?',
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
            console.log("this.campaign.id",this.campaign.id);
            let headers = new HttpHeaders({
                Authorization: 'Bearer ' + `${this.AuthService.accessToken }` 
            });
            console.log("headers",headers);
                this._campaignService.DeleteCampaign(this.campaign.id,headers).subscribe(res=>{
                    if(res.code==200){
                       this.toaster.success(res.message)
                        this.getList.emit()
                        window.location.reload()
                    console.log("this.getList",this.getList.emit())
                    }
                    else{
                      this.toaster.error(res.message)
                    }
                })
            }
        });
    }

    previewProposal() {
        // this._router.navigate(['/apps/campaigns/all/preview'])
        //this._router.navigate(['/apps/campaigns/preview']);
console.log(sessionStorage);
        this.viewClicked.next(true);
    }

    // OpenProposal(){
    //     this._router.navigate(['/apps/campaigns/preview']);

    // }

    viewInvitationList() {
        this._campaignService.getCampaignInvitedList(this.campaign.id).subscribe(response => {
            if (response.success) {
                this._matDialog.open(InviteCampaignPopupComponent, {
                    autoFocus: false,
                    data: {
                        campaign: response.payload.campaign,
                        influencers: response.payload.influencers
                    }
                });
            }
        })
        
    }

    safeHtml(imageURL: string) {
        return this._sanitizer.bypassSecurityTrustResourceUrl(imageURL);
    }

    ngOnDestroy(): void { }
}