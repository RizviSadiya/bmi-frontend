import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    OnDestroy,
    OnInit,
    Renderer2,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
    HostListener
} from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { CampaignsService } from 'app/modules/admin/apps/campaigns/campaigns.service';

@Component({
    selector       : 'uploadscript',
    templateUrl    : './uploadscript.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadscriptComponent implements OnInit,OnDestroy{

    
    /**
     * Constructor
     */

    planId:number = 0;
    userPlan:number = 0;
    application:any;
    channel:any;
    campaigns:any;
    constructor(
        private _userService: UserService,
        private _navigationService: NavigationService,
        private _campaignService: CampaignsService,
    )
    {
        
    }
    usergetplan:any;
    ngOnInit(): void {
        
        let test2=this._campaignService.setHireapplicationData(67)
        let test=this._campaignService.setHirechannelData(67)
        console.log('abhi',this.campaigns);
    }

    ngOnDestroy(): void {

    }
   
    
}
