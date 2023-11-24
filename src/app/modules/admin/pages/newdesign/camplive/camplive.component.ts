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
import { Router } from '@angular/router';


@Component({
    selector       : 'camplive',
    templateUrl    : './camplive.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampliveComponent implements OnInit,OnDestroy{

    
    /**
     * Constructor
     */

    planId:number = 0;
    userPlan:number = 0;
    constructor(
        private _userService: UserService,
        private _navigationService: NavigationService,
        private _campService:CampaignsService,
        private _route:Router

    )
    {
        
    }
    usergetplan:any;
    live_campData:any;
    ngOnInit(): void {
        this.userPlan = this._userService.userDetails.plan_id;
        console.log("userPlan", this.userPlan);
        this.live_campData = this._campService.getLiveCampData()
        console.log("live_campData",this.live_campData);
       
        
        // this._navigationService.getMenucount().subscribe(item=>{
        //     console.log("item",item);
        //     console.log("planId",item.payload.plan_id);
        //     this.planId = item.payload.plan_id;
        // })
        // return planId;

        
       
        // if(this.userPlan==3){
        //     this.usergetplan='<div class="cmplivemain mb-4 p-11"><div class="flex flex-auto justify-center  mx-auto mb-4 text-center campaignlive"><h1>Your campaign is now live and open to influencers for submitting proposals.</h1></div><div class="flex flex-auto justify-center  mx-auto mb-8 text-center campaignlive"><img src="/assets/images/bg_camp.png" /></div><div class="flex flex-auto justify-center  mx-auto mb-4 text-center campaignlive"><h2>You should now start inviting influencers to maximise your responses.</h2></div><div class="flex flex-auto justify-center  mx-auto"><button  class="camp-live-btn" mat-flat-button (click)="Recommendations()"><a   class="camp-live-btn">View Recommendations</a></button> </div></div>';
        // }

        // if(this.userPlan==2){
        //     this.usergetplan='<div class="cmplivemain mb-4 p-6"><div class="flex flex-auto justify-center  mx-auto"><div class="lg:flex flex-col col-md-7 p-5 payplancontent-width"><h1 class="mb-4">Your campaign is now awaiting approval.</h1><ul><li>You will NOT have auto-approvals of your campaigns.</li><li>You can create max 2 campaigns at any given time.</li><li>You will NOT be able to access or invite Premium influencers.</li></ul></div><div class="lg:flex flex-col col-md-5 p-5 payplancontent-width-right text-right images-right"><p class="mb-6">Your Current Plan : <span>  Starter </span></p><img src="/assets/images/bg1.png"/></div></div><div class="clearfix text-center "><h3 class="mb-3 colorredtext">Want to remove these restrictions?</h3><button ><a href="/choose-plan" class="mb-2 upgradebtn font-bold">Upgrade</a></button></div></div>';
        // }

        // if(this.userPlan==1){
        //     this.usergetplan='<div class="cmplivemain mb-4 p-6" id="footer"><div class="flex flex-auto justify-center  mx-auto"><div class="lg:flex flex-col col-md-7 p-5 payplancontent-width"><h1 class="mb-4">Your campaign is now awaiting approval.</h1><ul><li>You will have a longer campaign approval queue, which may take upto 24-72 hours. </li><li>Campaign visibility will remain private so no influencer can see your campaign till you invite them first. </li><li>You will NOT be able to access or invite Premium influencers.  </li><li>You can create only 1 campaign at any given time</li></ul></div><div class="lg:flex flex-col col-md-5 p-5 payplancontent-width-right text-right images-right"><p class="mb-6">Your Current Plan : <span>  Free </span></p><img src="/assets/images/bg1.png"/></div></div><div class="clearfix text-center "><h3 class="mb-3 colorredtext">Want to remove these restrictions?</h3><button ><a href="/choose-plan" class="mb-2 upgradebtn font-bold">Upgrade</a></button></div></div>';
        // }

    }
      
    upgrade(){
        this._route.navigate(['/choose-plan'])
    }

    Recommendations(){
         
        this._campService.setSimilardata(this.live_campData.payload)
        localStorage.setItem('category', JSON.stringify(this.live_campData.payload));

        this._route.navigate(['/pages/suggested-channels'])

    }

    ngOnDestroy(): void {

    }
   
    
}
