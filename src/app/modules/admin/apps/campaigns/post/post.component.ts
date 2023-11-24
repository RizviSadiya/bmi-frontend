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
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { FormControl, FormGroup,AbstractControl, FormBuilder, Validators, FormArray, ValidatorFn, ValidationErrors, FormGroupDirective, NgForm, MinLengthValidator } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { fromEvent, Observable, Subject, } from 'rxjs';
import { map } from 'rxjs/operators';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { ApexOptions } from 'ng-apexcharts';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { BreakpointObserver } from '@angular/cdk/layout';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { CampaignsService } from 'app/modules/admin/apps/campaigns/campaigns.service';
import { Campaign, Tag } from '../campaigns.types';
import { NotificationService } from 'app/core/services/notification.service';
import { ComponentCanDeactivate, IDeactivateComponent } from 'app/modules/admin/apps/campaigns/pending-changes.guard';
import { AppConstant } from 'app/app.constants';
import { InviteCampaignPopupComponent } from 'app/layout/common/invite-campaign-popup/invite-campaign-popup.component';
import { SelectCategoryPopupComponent } from 'app/layout/common/select-category-popup/select-category-popup.component';
import { CropImageComponent } from '../crop-image/crop-image.component';
import { ErrorStateMatcher } from '@angular/material/core';
import { UserService } from 'app/core/user/user.service';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { ApplicationsService } from '../../applications/applications.service';
import { BmiConfirmationService } from '@bmi/services/confirmation';
import { CampaignsAlertPopupComponent } from '../campaigns-alert-popup/campaigns-alert-popup.component';
import { DashboardService } from 'app/modules/admin/dashboard/dashboard.service';
export class InstantErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null,
        form: FormGroupDirective | NgForm | null): boolean {
        return control && control.invalid && (control.dirty || control.touched);
    }
}

@Component({
    selector: 'campaigns-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampaignsPostComponent implements OnInit, OnDestroy, ComponentCanDeactivate, IDeactivateComponent {

    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;

    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    campaignForm: FormGroup;
    addCampForm:FormGroup;
    publicForm: FormGroup;
    stepperOrientation: Observable<StepperOrientation>;
    isCampaignChoiceSelected: boolean = false;
    reviewMode: boolean = false;
    previewClicked: boolean = false;
    backFromPreviewScreen: boolean = false;
    editMode: boolean = false;
    id =null
    brandLogo: any;
    logoData: FormData = new FormData();
    selectedChoice: number = 0;
    selectedPreviousCampaign: any;
    previewCampaign: Campaign;
    selectedCampaign: Campaign;
    selectedCampaignId: number;

    previousCampaignsList: Campaign[];
    previousCampaignForm: FormGroup;
    changeConfirmationForm: FormGroup;
    nextClicked: boolean = false;
    // previousSelectedCampaign: Campaign;
    draftedCampaignList: Campaign[] = [];
    draftCampaignForm: FormGroup;
    tagsEditMode: boolean = false;
    tags: any[] = ['ENTERTAINMENT', 'FOOD', 'TRAVEL', 'VLOGGERS'];
    filteredTags: any[] = ['ENTERTAINMENT', 'FOOD', 'TRAVEL', 'VLOGGERS'];
    selectedTags: any[] = [];
    nextStateRoute: string = null;
    referenceVideos: string[];
    categories: string[];
    helpText: string;
    planId:number = 0
    brandUrlText:string;
    titleText:string;
    descriptionText:string;
    chartQualification: ApexOptions;
    croppedImage: any = '';
    graphedData: any;
    errorStateMatcher = new InstantErrorStateMatcher();
    userPlan: number = 1;
    mode = 'determinate';
    engamentRate;
    plateform='youtube'

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _formBuilder: FormBuilder,
        private _campaignsService: CampaignsService,
        private _applicationsService: ApplicationsService,
        breakpointObserver: BreakpointObserver,
        private _notifyService: NotificationService,
        private _renderer2: Renderer2,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private _matDialog: MatDialog,
        private _userService: UserService,
        private _navigationService: NavigationService,
        private _bmiConfirmationService: BmiConfirmationService,
        private _dashboardService: DashboardService,
    ) {
        this.stepperOrientation = breakpointObserver
            .observe('(min-width: 800px)')
            .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    }

   

    currency:any;
    planDetails:any;
    data:any;
    revealedChannels:any
    res:any
    ngOnInit(): void {
        this.campaignChoiceSelected(1)
        let url = window.location.href
        console.log("url",url);
         this.res = url.split('post/');
        console.log("res",this.res);
        this.planDetails = JSON.parse(sessionStorage.getItem('planDetail')) 

        this._navigationService.getMenucount().subscribe(item=>{
            console.log("item",item);
            
            if(item.payload.plan_id == 3 || item.payload.plan_id == 2){
                // console.log("count",item.payload,item);
                this.planId = 1 
                // this.planId = this.selectedCampaign?.visibility
                console.log("planId",this.planId);
                
                this.revealedChannels=item.payload.revealedChannels
                console.log("revealedChannelscount",this.revealedChannels);
                }
               
        })

        this._dashboardService.getDashboardData().subscribe((data:any)=>{
            if (data['payload']) {
                // Store the data
                this.data = data['payload'];                    
            }                
        })
        this.currency = this._userService.userDetails
        console.log("this.currency", this.currency)
        this.selectedCampaignId = this._activatedRoute.firstChild?.snapshot.params['id'];
        this.userPlan = +this._userService.userDetails.plan_id;
        console.log("userPlan",this.userPlan);
        this._campaignsService.setdemoData(this.selectedCampaign);
        this._campaignsService.setSaveButtonClicked$(null);
        console.log(this.selectedCampaignId);
        if (this.selectedCampaignId) {
            this._campaignsService.campaign$
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((campaign: Campaign) => {
                    // console.log(campaign);
                    if (campaign) {
                        this.selectedCampaign = campaign;
                        // console.log("selectedCampaign",this.selectedCampaign);
                        this.editMode = true; 
                        this.plateFormType=this.selectedCampaign.plateform_type
                    }
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                });
            // this._campaignsService.getCampaignById(this.res[1]).subscribe(data=>{
            //     if(data){
            //         this.selectedCampaign = data['payload'];
            //         console.log("data",this.selectedCampaign);
            //         this.editMode = true;   
                    
    
            //     }
            //     this._changeDetectorRef.markForCheck();
    
            // })
        } else {
            this._campaignsService.campaigns$
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((campaigns: Campaign[]) => {
                    console.log(campaigns);
                    if (campaigns) {
                        this.previousCampaignsList = campaigns;
                    }
                    this._changeDetectorRef.markForCheck();
                });
            this._campaignsService.draftCampaigns$
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((campaigns: Campaign[]) => {
                    console.log(campaigns);
                    if (campaigns) {
                        this.draftedCampaignList = campaigns;
                    }
                    this._changeDetectorRef.markForCheck();
                });
                
        }
        this.createCampaignForm();
        if (this.selectedCampaign) {
            this.croppedImage = this.selectedCampaign.brand_logo;
        }
        if (this.editMode) {
            // this.removeLogoAsRequiredField();
            this.croppedImage = this.selectedCampaign.brand_logo;
        } else {
            // Add reference video field if normal mode
            this.addReferenceVideoField();
        }

        this._campaignsService.saveButtonClicked$.subscribe(buttonClicked => {
            this.nextStateRoute = this._campaignsService.getNextRouteSelectedBeforeSave();
            console.log("buttonClicked",buttonClicked);
            console.log("nextStateRoute",this.nextStateRoute);

            if (buttonClicked === true) {
        // let type = (this.selectedCampaign.id) ? 'edit'  :'add'    
        console.log("this.selectedCampaign?.id",this.selectedCampaign?.id);
         
                // if(this.selectedCampaign?.id===undefined){
                //     // alert("hello")
                // this.postCampaign("draft");

                // }else{
                // this.postCampaign("draft");

                // }
        
            }
             else if (buttonClicked === false) {
                this.campaignForm.get('step1').get('camp_title').patchValue(null);
                this._router.navigate([this.nextStateRoute]);
                console.log("this.nextStateRoute",this.nextStateRoute);
                // this.campaignForm.reset()
                return true;
            } 
        });
               this.previewClicked= this._applicationsService.getPreviewMode();
               let formValue = this.campaignForm.getRawValue();
               let campaign = { ...formValue.step1, ...formValue.step2, ...formValue.step3 };
                this.previewCampaign = campaign;

               
    }

    SelectPlatform(plateform){
        console.log("plateform",plateform);
       
        this.plateform=plateform
        this.selectedTags=[]
        if(this.plateform==='instagram'){
            let payload = {
                "status": "3",
                // "limit": "5",
                // "offset": "0"
                "page":"1",
                "perPage":"10",
                'plateform_type':'2'
            };
            this._campaignsService.getCampaigns(payload).subscribe(res=>{
                this.draftedCampaignList=res['payload'].campaign
            })
        }else{
            let payload = {
                "status": "3",
                // "limit": "5",
                // "offset": "0"
                "page":"1",
                "perPage":"10",
                'plateform_type':'1'
            };
            this._campaignsService.getCampaigns(payload).subscribe(res=>{
                this.draftedCampaignList=res['payload'].campaign
            })
        }
        // const validationaverage_view = this.campaignForm.get('step3').get('average_view').value
        // const validationsubscriber = this.campaignForm.get('step3').get('subscriber').value

        // if(plateform==='instagram'){
          
        //     validationaverage_view.setValidators(null);
        //     validationsubscriber.setValidators(null);
        //     validationaverage_view.disable();
        //     validationsubscriber.disable();
        // }
        // else {
        //     console.log("enable two...")
        //     validationaverage_view.enable();
        //     validationsubscriber.enable();
        //     validationaverage_view.setValidators([Validators.required]);
        //     validationsubscriber.setValidators([Validators.required]);
        // }
        // validationaverage_view.updateValueAndValidity();
        // validationsubscriber.updateValueAndValidity();

    }

    // unSaved: boolean = true;        
  
    // canDeactivatee(): Observable<boolean> | boolean {


    //     if (this.unSaved) {

    //       const result = window.confirm('There are unsaved changes! Are you sure?');

    //        return Observable.of(result);
    //     }
    //     return true;
    // }  
   

    uploadImage() {
        const cropImagePopup = this._matDialog.open(CropImageComponent, {
            maxHeight: '100vh',
            autoFocus: false
        });

        cropImagePopup.afterClosed().subscribe(result => {
            if (result) {
                console.log("result",result);
                
                this.croppedImage = result;
                this.campaignForm.controls.step1.patchValue({
                    brand_logo: result
                });
                this._changeDetectorRef.markForCheck();
            }
        })
    }

    navigatePath:any
    canExit() : boolean {
        // if (confirm) {
        //   this.confirmationpopUp()
        let route
        if (this.campaignForm.get('step1').get('brand_name').value !=null && !this.previewClicked) {
     route=  this._campaignsService.getNextRouteSelectedBeforeSave()
     this.navigatePath=  this._campaignsService.getNextRouteSelectedBeforeSave()
          console.log("route",route);
          
        //   if(this.addCampForm.valid){
            if(this.selectedCampaign?.status !='1'){
                // this.plateform='instagram'

          this.postCampaign("draft")

            }else{
            return true

            }


        //   }
          return false

          } else {
            return true
          }
        }

    canDeactivate(): boolean {
        
    //   return this.openConfirmDialog();
//    return true
        let brand_name = this.campaignForm.get('step1').get('brand_name');
        let brand_url = this.campaignForm.get('step1').get('brand_url');
        let brand_logo = this.campaignForm.get('step1').get('brand_logo');
        let camp_title = this.campaignForm.get('step1').get('camp_title');
        let camp_desc = this.campaignForm.get('step1').get('camp_desc');
        // let promot_product = this.campaignForm.get('step2').get('promot_product');
        // let duration = this.campaignForm.get('step2').get('duration');
        // let promotion_start = this.campaignForm.get('step2').get('promotion_start');
        // let new_duration = this.campaignForm.get('step2').get('new_duration');
        let currency = this.campaignForm.get('step2').get('currency');
        let budget = this.campaignForm.get('step2').get('budget');
        let category = this.campaignForm.get('step2').get('category');
  
        if (brand_name.dirty && brand_name.status === "VALID" && brand_url.dirty && brand_url.status === "VALID"
            && brand_logo.status === "VALID" && camp_title.dirty && camp_title.status === "VALID"
            // && promot_product.dirty && promot_product.status === "VALID" 
            // && duration.dirty && duration.status === "VALID" 
            // && promotion_start.dirty && promotion_start.status === "VALID" 
            && camp_desc.dirty && camp_desc.status === "VALID" 
            && currency.dirty && currency.status === "VALID" 
            && budget.dirty && budget.status === "VALID" 
            && category.dirty && category.status === "VALID" 
         
            ) {
                
            return true;
        } 
        else {
            
            return false;
        }
    }
    // openConfirmDialog() {
    //     let returnValue = false;
    //     this.changeConfirmationForm = this._formBuilder.group({
    //         title: 'Save your changes',
    //         message: 'WARNING: You have unsaved changes. Press Save to DRAFT your changes to edit it later.',
    //         icon: this._formBuilder.group({
    //             show: true,
    //             name: 'heroicons_outline:exclamation',
    //             color: 'warn'
    //         }),
    //         actions: this._formBuilder.group({
    //             confirm: this._formBuilder.group({
    //                 show: true,
    //                 label: 'Save',
    //                 color: 'warn'
    //             }),
    //             cancel: this._formBuilder.group({
    //                 show: true,
    //                 label: 'Cancel',
    //             })
    //         }),
    //         dismissible: false
    //     });

    //     // Open the dialog and save the reference of it
    //     const dialogRef = this._bmiConfirmationService.open(this.changeConfirmationForm.value);
    //     // console.log(dialogRef.beforeClosed().pipe().);
    //     dialogRef.afterClosed().subscribe((result) => {
    //         console.log(result,'check result');
            
    //         if (result === "confirmed") {
    //             returnValue = false;
    //             this._campaignsService.setSaveButtonClicked$(true);
    //         } else {
    //             returnValue = true;
    //             this._campaignsService.setSaveButtonClicked$(false);
    //         }
    //     });
    //     return returnValue;
    // }

    createCampaignForm() {        
        this.campaignForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                id: [this.selectedCampaign?.id? this.selectedCampaign?.id:null],
                
                brand_name: [this.selectedCampaign?.brand_name? this.selectedCampaign?.brand_name:null, [Validators.required]],
                brand_url: [this.selectedCampaign?.brand_url ? this.selectedCampaign?.brand_url:null, [Validators.required, Validators.pattern(AppConstant.REGEX.URLL_REG)]],
                // brand_url: [this.selectedCampaign?.brand_url, [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
                brand_logo: [this.selectedCampaign?.brand_logo ? this.selectedCampaign?.brand_logo: null, [Validators.required]],
                camp_title: [this.selectedCampaign?.camp_title ? this.selectedCampaign?.camp_title:null, [Validators.required]],
                // camp_title: [this.selectedCampaign?.camp_title, [Validators.required, Validators.pattern(AppConstant.REGEX.NAME_REG)]],
                camp_desc: [this.selectedCampaign?.camp_desc? this.selectedCampaign?.camp_desc:null, [Validators.required]]
            }),
            step2: this._formBuilder.group({
                promot_product: [this.selectedCampaign?.promot_product ? this.selectedCampaign?.promot_product: null, Validators.required],
                duration: [{ value: this.selectedCampaign?.duration,disabled:false }],
                promotion_start: [{ value: this.selectedCampaign?.promotion_start,disabled:false}],
                // duration: [{value:this.selectedCampaign?.duration ==='undefined',disabled:true } ||{value:this.selectedCampaign?.duration !='undefined',disabled:false } ],
                // promotion_start: [{value:this.selectedCampaign?.promotion_start==='undefined', disabled:true} 
                //  || {value:this.selectedCampaign?.promotion_start !='undefined' ,disabled:false}],
                new_duration: [''],
                
                referenceVideo: this._formBuilder.array([]),
                currency: [this.currency.currency],
                // currency: [this.selectedCampaign?.currency ? this.selectedCampaign?.currency : this.currency.currency],
                budget: [this.selectedCampaign?.budget ? this.selectedCampaign?.budget:0, [Validators.required]],
                // budget: [this.selectedCampaign?.budget, [Validators.required, Validators.pattern(AppConstant.REGEX.budget_REG)]],
                category: this._formBuilder.array([], Validators.required),
                visibility: [JSON.stringify(this.selectedCampaign?.visibility)?JSON.stringify(this.selectedCampaign?.visibility):JSON.stringify(this.planId)]
                // visibility: [JSON.stringify(this.selectedCampaign?.visibility)]
                // visibility: [JSON.stringify(this.planId), Validators.required]
                // visibility: [JSON.stringify(this.planId), Validators.required]
                // invite_only: [{value: '0', disabled: this.userPlan === 1}, Validators.required] [Validators.required], [Validators.required]
            }),
            step3: this._formBuilder.group({
                average_view: [this.selectedCampaign ? this.selectedCampaign.average_view : null],
                subscriber: [this.selectedCampaign ? JSON.stringify(this.selectedCampaign.subscriber)  : null,''],
                engagement_rate: [this.selectedCampaign ? JSON.stringify(this.selectedCampaign.engagement_rate) : null,''],
                followers: [this.selectedCampaign ? JSON.stringify(this.selectedCampaign.followers) : '', ''],
                inf_score: [this.selectedCampaign ? JSON.stringify(this.selectedCampaign.inf_score) : '', '']
            })
        });

        this.addCampForm= this._formBuilder.group({
            brand_name:[''],
            brand_url:[''],
            brand_logo:[''],
            camp_title:[''],
            camp_desc:[''],
            promot_product:[''],
            duration:[''],
            promotion_start:[''],
            new_duration:[''],
            currency:[''],
            budget:[''],
            category:[''],
            reference_videos:[''],
            visibility:[''],
            average_view:[''],
            subscriber:[''],
            engagement_rate:[''],
            followers:[''],
            inf_score:[''],
            id:[''],
            plateform:[this.selectedCampaign?.plateform],
            type:['']
        })
        // this.selectedCampaign.plateform
      console.log("campaignForm",this.campaignForm.value)
      console.log("selectedCampaign",this.selectedCampaign)
      if(this.selectedCampaign){
      this.plateform =this.selectedCampaign.plateform

      }
      console.log("JSON.stringify(this.planId)",JSON.stringify(this.planId))
      console.log("this.selectedCampaign?.visibility",JSON.stringify(this.selectedCampaign?.visibility))
             
        if(this.selectedCampaign?.engagement_rate) {
            this.engamentRate = this.selectedCampaign.engagement_rate
            this.campaignForm.get('step3').get('engagement_rate').setValue(this.selectedCampaign.engagement_rate) 
        }
        if(this.selectedCampaign?.average_view==null) {
            // this.engamentRate = this.selectedCampaign.engagement_rate
            this.campaignForm.get('step3').get('average_view').setValue('') 
        }
        if(this.selectedCampaign?.subscriber==null) {
            // this.engamentRate = this.selectedCampaign.engagement_rate
            this.campaignForm.get('step3').get('subscriber').setValue('') 
        }
        if(this.selectedCampaign?.engagement_rate==0) {
            // this.engamentRate.setValue('') 
            this.campaignForm.get('step3').get('engagement_rate').setValue('') 
        }
        if(this.selectedCampaign?.id) {
            this.editMode=true;
            // console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj');
            
        }else{
            this.editMode=false;

        }
        if (this.selectedCampaign?.reference_videos) {
            this.referenceVideos = this.selectedCampaign.reference_videos.split(",");
            // (this.campaignForm.get('step2') as FormGroup).setControl('referenceVideo', this._formBuilder.array(this.referenceVideos || []));

            for (let i = 0; i < this.referenceVideos.length; i++) {
                let referenceVideoFormGroup = this._formBuilder.group({
                    video: [this.referenceVideos[i], Validators.pattern(AppConstant.REGEX.URL_REG)]
                });
                (this.campaignForm.get('step2').get('referenceVideo') as FormArray).push(referenceVideoFormGroup);
            }

        }

        (this.campaignForm.get('step2') as FormGroup).setControl('category', this._formBuilder.array(this.selectedCampaign?.category || []));
    }

    duplicates = [];
    hasDuplicate(key_form): ValidatorFn {
        return (formArray: FormArray): { [key: string]: any } | null => {
            if (this.duplicates) {
                for (var i = 0; i < this.duplicates.length; i++) {
                    let errors = (this.campaignForm.get('step2').get('referenceVideo') as FormArray).at(this.duplicates[i]).get(key_form).errors as Object || {};
                    delete errors['duplicated'];
                    (this.campaignForm.get('step2').get('referenceVideo') as FormArray).at(this.duplicates[i]).get(key_form).setErrors(errors as ValidationErrors);
                }
            }
            console.log(this.duplicates);

            let dict = {};
            formArray.value.forEach((item, index) => {
                dict[item.video] = dict[item.video] || [];
                dict[item.video].push(index);
            });
            let duplicates = [];
            for (var key in dict) {
                if (dict[key].length > 1) duplicates = duplicates.concat(dict[key]);
            }
            this.duplicates = duplicates;

            for (const index of duplicates) {
                formArray.at(+index).get(key_form).setErrors({ duplicated: true });
            }

            return duplicates.length > 0 ? { error: 'Has Duplicate !!!' } : null;
        };
    }

    notification(){
        if(this.userPlan===1){
            this.publicForm = this._formBuilder.group({
                title: 'Upgrade Plan',
                message: 'Only paid users can publish Publicly visible campaigns. Please upgrade your plan to enable this feature.',
                icon: this._formBuilder.group({
                    show: true,
                    name: 'heroicons_outline:exclamation',
                    color: 'warn'
                }),
                actions: this._formBuilder.group({
                    confirm: this._formBuilder.group({
                        show: true,
                        label: 'Upgrade Plan',
                        color: 'success'
                    }),
                    cancel: this._formBuilder.group({
                        show: true,
                        label: 'Cancel'
                    })
                }),
                dismissible: true
            });
    
            // Open the dialog and save the reference of it
            const dialogRef = this._bmiConfirmationService.open(this.publicForm.value);
    
            // Subscribe to afterClosed from the dialog reference
            dialogRef.afterClosed().subscribe((result) => {
                if (result === "confirmed") {
                
                    // this._campaignService.DeleteProposal(this.application.id).subscribe(res=>{
                    //     if(res.code==200){
                    //        this.toaster.success(res.message)
                    //         this.getList.emit()
                    //         window.location.reload()
                    //     console.log("this.getList",this.getList.emit())
                    //     }
                    //     else{
                    //       this.toaster.error(res.message)
                    //     }
                    // })
                    this._router.navigate(['/choose-plan'])
                
                }
            });
           this.selectedCampaign.visibility=0
        }
        // if(this.userPlan===1){
        //     this._notifyService.showError("we should prompt user to upgrade as this feature is only for paid plans.","Error")
        //     this.campaignForm.get('step2').get('visibility').setValue(this.userPlan)
        // }
        // console.log("planId",this.campaignForm.get('step2').get('visibility').value,)
    }

    CampLivenotification(){
        if(this.userPlan===1){
            this.publicForm = this._formBuilder.group({
                title: 'Upgrade Plan',
                message: '  You Need to Upgrade to Starter or Business plan for creating more  then 1 Live campaign. ',
                icon: this._formBuilder.group({
                    show: true,
                    name: 'heroicons_outline:exclamation',
                    color: 'warn'
                }),
                actions: this._formBuilder.group({
                    confirm: this._formBuilder.group({
                        show: true,
                        label: 'Upgrade Plan',
                        color: 'success'
                    }),
                    cancel: this._formBuilder.group({
                        show: true,
                        label: 'Cancel'
                    })
                }),
                dismissible: true
            });
    
            // Open the dialog and save the reference of it
            const dialogRef = this._bmiConfirmationService.open(this.publicForm.value);
    
            // Subscribe to afterClosed from the dialog reference
            dialogRef.afterClosed().subscribe((result) => {
                if (result === "confirmed") {
                
                    // this._campaignService.DeleteProposal(this.application.id).subscribe(res=>{
                    //     if(res.code==200){
                    //        this.toaster.success(res.message)
                    //         this.getList.emit()
                    //         window.location.reload()
                    //     console.log("this.getList",this.getList.emit())
                    //     }
                    //     else{
                    //       this.toaster.error(res.message)
                    //     }
                    // })
                    this._router.navigate(['/choose-plan'])
                
                }
            });
           
        } 
        else if(this.userPlan===2){
            this.publicForm = this._formBuilder.group({
                title: 'Upgrade Plan',
                message: '  You Need to Upgrade to  Business plan for creating more  then 2 Live campaign. ',
                icon: this._formBuilder.group({
                    show: true,
                    name: 'heroicons_outline:exclamation',
                    color: 'warn'
                }),
                actions: this._formBuilder.group({
                    confirm: this._formBuilder.group({
                        show: true,
                        label: 'Upgrade Plan',
                        color: 'success'
                    }),
                    cancel: this._formBuilder.group({
                        show: true,
                        label: 'Cancel'
                    })
                }),
                dismissible: true
            });
    
            // Open the dialog and save the reference of it
            const dialogRef = this._bmiConfirmationService.open(this.publicForm.value);
    
            // Subscribe to afterClosed from the dialog reference
            dialogRef.afterClosed().subscribe((result) => {
                if (result === "confirmed") {
                
                    // this._campaignService.DeleteProposal(this.application.id).subscribe(res=>{
                    //     if(res.code==200){
                    //        this.toaster.success(res.message)
                    //         this.getList.emit()
                    //         window.location.reload()
                    //     console.log("this.getList",this.getList.emit())
                    //     }
                    //     else{
                    //       this.toaster.error(res.message)
                    //     }
                    // })
                    this._router.navigate(['/choose-plan'])
                
                }
            });
        }
        // if(this.userPlan===1){
        //     this._notifyService.showError("we should prompt user to upgrade as this feature is only for paid plans.","Error")
        //     this.campaignForm.get('step2').get('visibility').setValue(this.userPlan)
        // }
        // console.log("planId",this.campaignForm.get('step2').get('visibility').value,)
    }

    changeHelpText(inputName: string) {
        switch (inputName) {
            case "brandName":
                this.helpText = "Enter your brand name.e.g. Sony, Amazon, etc.<br/>or<br/>If you want to post requirement for a particular product from your brand enter the product name.<br/>e.g., Playstation 4"
                break;
            case "brandUrl":
                this.brandUrlText = "Please enter the website for your product/service/app.<br/>Influencers may use this to learn more about your offerings."
                break;
            case "title":
                this.titleText = "Here are some examples<br/>1. Looking for entertainment influencer for gaana.<br/>2. Promoting festive offers through lifestyle influencer for Myntra<br/>3. Need content creators talking about prenting for parenting.com";
                break;
            case "description":
                this.descriptionText = "Enter the complete campaign description. Influencers may need this to apply.";
                break;
            default:
                this.removeHelpText()
                break;
        }
    }

    removeHelpText() {
        this.helpText = null;
        this.brandUrlText = null;
        this.titleText = null;
        this.descriptionText = null;    }
        amount:any
        onKeyUpEventbudget(event){
            // console.log("KeyUp",event.target.value);
            this.amount= event.target.value
            // if(this.campaignForm.get('step2').get('currency').value==="INR"){
            //     if(this.amount<5000){
            // // this._notifyService.showError(" Minimum amount should be 5000 INR", "error")

            //     }

            // }
            // else{
            // // this._notifyService.showError(" Minimum amount should be 62 USD ", "error")

            // }
        }
    secondNextButtonClicked() {
        if(this.campaignForm.get('step2').get('currency').value ==="USD"){
            console.log("this.campaignForm",this.campaignForm.value)
        }
        else if(this.campaignForm.get('step2').get('currency').value==="INR"&& this.campaignForm.get('step2').get('budget').value < 5000){
          this.amount=this.campaignForm.get('step2').get('budget').value
            console.log("this.campaignForm",this.campaignForm.value)
            console.log("this.amount",this.amount)
            this._notifyService.showError(" Minimum amount should be 5000 ", "error")
            return
        }
        // this.campaignForm.get('step3').get('engagement_rate').setValue(this.engamentRate)
        if(this.plateform==='instagram'){
            this.plateFormType ='2'
        }
        let payload = {
            "subscriber": this.campaignForm.get('step3').get('subscriber').value,
            "average_view": this.campaignForm.get('step3').get('average_view').value,
            "engagement_rate": this.campaignForm.get('step3').get('engagement_rate').value,
            "inf_score": this.campaignForm.get('step3').get('inf_score').value,
            "followers": this.campaignForm.get('step3').get('followers').value,
            "search_keyword": this.selectedTags?.toString() ,
            "plateform_type":this.plateFormType

        };
      console.log("campaignForm",this.campaignForm.value);
      
        this.getGraphDataFromServer(payload);
    }

    plateFormType:any=1
    getGraphDataFromServer(payload: any) {
        this._campaignsService.getGraphData(payload).subscribe(data => {
            if (data.success) {
                this.graphedData = data.payload;
                this.getChartData();
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    getChartData() {
        this.chartQualification = {
            chart: {
                animations: {
                    speed: 400,
                    animateGradually: {
                        enabled: false
                    }
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'donut',
                sparkline: {
                    enabled: true
                },
            },
            colors: ['#DD6B20', '#3182CE'],
            labels: ['Non-premium Influencers', 'Premium Influencers'],
            plotOptions: {
                pie: {
                    customScale: 0.9,
                    expandOnClick: true,
                    donut: {
                        size: '70%',
                        labels: {
                            show: true,
                            total: {
                                show: true,
                                showAlways: true,
                                label: 'Total Influencers'
                            },
                        }
                    }
                }
            },
            series: [this.graphedData.nonPremiumInfluencer, this.graphedData.premiumInfluencer],
            states: {
                hover: {
                    filter: {
                        type: 'none'
                    }
                },
                active: {
                    filter: {
                        type: 'none'
                    }
                }
            },
            tooltip: {
                enabled: true,
                fillSeriesColor: false,
                theme: 'dark',
                custom: ({
                    seriesIndex,
                    w
                }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                                    <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
                                                    <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
                                                    <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}</div>
                                                </div>`
            }
        };

    }

    campaignChoiceSelected(selection: number) {
        this.previousCampaignForm = this._formBuilder.group({ campaign_id: [''] });
        const prevCampaignId = this.previousCampaignForm.get("campaign_id");

        this.draftCampaignForm = this._formBuilder.group({ campaign_id: [''] });
        const draftCampaignId = this.draftCampaignForm.get("campaign_id");

        this.isCampaignChoiceSelected = false;
        this.selectedChoice = selection;
        this.selectedPreviousCampaign = null;
        if (selection === 1) {
            this.isCampaignChoiceSelected = true;
            prevCampaignId.setValue('');
            prevCampaignId.setValidators(null);
            draftCampaignId.setValue('');
            draftCampaignId.setValidators(null);
        } else if (selection === 2) {
            prevCampaignId.setValue('');
            prevCampaignId.setValidators(null);
            if (this.draftedCampaignList.length === 0) {
                this.getDraftedCampaign();
            }
            draftCampaignId.setValue('');
            draftCampaignId.setValidators([Validators.required]);
        } else if (selection === 3) {
            prevCampaignId.setValue('');
            prevCampaignId.setValidators([Validators.required]);
            draftCampaignId.setValue('');
            draftCampaignId.setValidators(null);
        }
        prevCampaignId.updateValueAndValidity();
        draftCampaignId.updateValueAndValidity();
    }

    editCampaignSelected:boolean = false;
    campaignSelected(value,camptyp,stepper: MatStepper) {
        console.log("value",value,"camptyp",camptyp)
        this.selectedPreviousCampaign = value;
        this.isCampaignChoiceSelected = true;
        if(camptyp==='draft'){
            this.editCampaignSelected = false;
            // this.editMode = false
            // stepper.next()
        }
        else{
            this.editCampaignSelected = true;
        }
        
    }

    getDraftedCampaign() {
        let payload = {
            "limit": 10,
            "offset": "0",
            "status": "2"
        };
        this._campaignsService.getDraftCampaigns(payload).subscribe(data => {
            if (data['success']) {
                this.draftedCampaignList = data['payload'].campaign;
            } else {
                this.draftedCampaignList = [];
            }
        })
    }


    firstNextClicked(stepper: MatStepper) {
        console.log(stepper,this.selectedPreviousCampaign,'asss');
        
        this.nextClicked = true;
        this.croppedImage = "";
        if (this.previousCampaignForm.invalid) {
            return;
        }
        if (this.draftCampaignForm.invalid) {
            return;
        }

        if (this.selectedPreviousCampaign) {
            this._campaignsService.getCampaignById(this.selectedPreviousCampaign).subscribe(data => {
                if (data['payload']) {
                    this.selectedCampaign = data['payload'];
                    this.createCampaignForm();
                    this.croppedImage = this.selectedCampaign.brand_logo;
                    // this.promotionTypeSelection({ value: this.selectedCampaign.promot_product });
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                    if(this.editCampaignSelected === false) {
                        // stepper.next();
                    } else{
                        this.openDialog(stepper)
                    }
                }
            });
        } else {
            this.selectedCampaign = null;
            this.createCampaignForm();
            this.croppedImage = null;
            this._changeDetectorRef.markForCheck();
            
            stepper.next();
        }
    }


       openDialog(stepper: MatStepper): void {
        console.log("this.selectedCampaign.camp_title",this.selectedCampaign.camp_title);
        console.log("this.selectedCampaign.camp_title",this.campaignForm.get('step1').get('camp_title').value);
        
        if(this.selectedCampaign.camp_title === this.campaignForm.get('step1').get('camp_title').value){
            const dialogRef = this._matDialog.open(DialogOverviewExampleDialog, {
                width: '450px',
              });
          
              dialogRef.afterClosed().subscribe(result => {
              //   console.log('The dialog was closed',result);
                if(result) {
                  stepper.next() 
                }
              });
        }else{
            this.selectedCampaign.id=''
          this.editMode = false
            stepper.next() 
        }
        // stepper.next()
      }

     
    nextStep(stepper: MatStepper) {
        console.log('stepper',stepper)
        console.log('selectedPreviousCampaign',this.selectedPreviousCampaign)
        console.log('editCampaignSelected',this.editCampaignSelected)
        console.log('isCampaignChoiceSelected',this.isCampaignChoiceSelected)
        if(this.editCampaignSelected===false){
            // this.openDialog(stepper)
            stepper.next()
        }
        else{
            this.openDialog(stepper)
            // if(this.nxtValue===true){
            //     this.dialogRef.close(val);
            // }
            // stepper.next()
        }
       
    }

    Openmodel(){
       
            // const dialogRef = this._matDialog.open(CampaignsAlertPopupComponent, {
            //   width: '350px',
            //   data:this.data
            // });
        
            // dialogRef.afterClosed().subscribe(result => {
            //   console.log('The dialog was closed');
            // });

            if(this.userPlan===1 || this.userPlan===2){
                this.publicForm = this._formBuilder.group({
                    title: 'Restricted to business plan users only',
                    message: 'You should select Average Views to upgrade as this feature is only for Business plans.?',
                    icon: this._formBuilder.group({
                        show: true,
                        name: 'heroicons_outline:exclamation',
                        color: 'warn'
                    }),
                    actions: this._formBuilder.group({
                        confirm: this._formBuilder.group({
                            show: true,
                            label: 'Upgrade Plan',
                            color: 'success'
                        }),
                        cancel: this._formBuilder.group({
                            show: true,
                            label: 'Cancel'
                        })
                    }),
                    dismissible: true
                });
        
                // Open the dialog and save the reference of it
                const dialogRef = this._bmiConfirmationService.open(this.publicForm.value);
        
                // Subscribe to afterClosed from the dialog reference
                dialogRef.afterClosed().subscribe((result) => {
                    if (result === "confirmed") {
                        this._router.navigate(['/choose-plan'])
                    }
                });  
            }  
          }
    
  
    markTouched() {
        this.campaignForm.get('step1').get('brand_url').markAsTouched();
        this.campaignForm.get('step1').get('brand_url').updateValueAndValidity();
      }

    promotionTypeSelection(event: any) {
        console.log("check for promotion....")
        console.log(event);
        const promotionDuration = this.campaignForm.get("step2").get("duration");
        const promotionInstance = this.campaignForm.get("step2").get("promotion_start");
        const newDuration = this.campaignForm.get("step2").get("new_duration");
        if (event.value === "Dedicated Video Promotion") {
            promotionDuration.setValidators(null);
            promotionInstance.setValidators(null);
            promotionDuration.disable();
            promotionInstance.disable();
            this.campaignForm.get('step2').get('duration').reset()
            this.campaignForm.get('step2').get('promotion_start').reset()
            
        }
        else if(event.value === "Short Video Promotion"){
            promotionDuration.setValidators(null);
            promotionInstance.setValidators(null);
            promotionDuration.disable();
            promotionInstance.disable();
            this.campaignForm.get('step2').get('duration').reset()
            this.campaignForm.get('step2').get('promotion_start').reset()
            
        }
        // else if(event.value === "Short Video Promotion"){
        //     promotionDuration.setValidators(null);
        //     promotionInstance.setValidators(null);
        //     promotionDuration.disable();
        //     promotionInstance.disable();
        // }
        else if(event.value === "Reels"){
            promotionDuration.setValidators(null);
            promotionInstance.setValidators(null);
            promotionDuration.disable();
            promotionInstance.disable();
        }
        else if(event.value === "Posts"){
            promotionDuration.setValidators(null);
            promotionInstance.setValidators(null);
            promotionDuration.disable();
            promotionInstance.disable();
        }
        else if(event.value === "Stories"){
            promotionDuration.setValidators(null);
            promotionInstance.setValidators(null);
            promotionDuration.disable();
            promotionInstance.disable();
        }
         else {
            console.log("enable two...")
            promotionDuration.enable();
            promotionInstance.enable();
            promotionDuration.setValidators([Validators.required]);
            promotionInstance.setValidators([Validators.required]);
        }
        promotionDuration.updateValueAndValidity();
        promotionInstance.updateValueAndValidity();
        newDuration.setValidators(null);
        newDuration.updateValueAndValidity();
    }

    durationSelection() {
        const newDuration = this.campaignForm.get("step2").get("new_duration");
        if (this.campaignForm.value.step2.duration === "Others") {
            newDuration.setValidators([Validators.required]);
        } else {
            newDuration.setValidators(null);
        }
        newDuration.updateValueAndValidity();
    }

    removeLogoAsRequiredField() {
        if (this.editMode) {
            const brandLogo = this.campaignForm.get("step1").get("brand_logo");
            brandLogo.setValidators(null);
            brandLogo.updateValueAndValidity();

            this.promotionTypeSelection({ value: this.selectedCampaign.promot_product });
        }
    }

    toggleReviewMode(reviewMode: boolean | null = null): void {
        if (reviewMode === null) {
            this.reviewMode = !this.reviewMode;
        } else {
            this.reviewMode = reviewMode;
    
        }        
        let formValue = this.campaignForm.getRawValue();
        let campaign = { ...formValue.step1, ...formValue.step2, ...formValue.step3 };
        campaign.isReadMore = true;
        if (this.selectedCampaign) {
            campaign.category = this.selectedCampaign.category;
        } else {
            campaign.category = this.selectedTags;
        }
        this.previewCampaign = campaign;
        this.referenceVideos = this.campaignForm.get('step2').get('referenceVideo').value;
        this.categories = campaign.category;
        // Mark for check
        this._changeDetectorRef.markForCheck();
        console.log("campaignForm",this.campaignForm.value);
        
    }

    backFromPreview() {
        this.reviewMode = false;
        this.previewClicked = false;
        this.backFromPreviewScreen = true;
        console.log(this.campaignForm.getRawValue());
        console.log(this.campaignForm.get('step1').errors);
    }
    
    backPreview() {
        this.previewClicked = false;
        
        this._router.navigate(['/apps/campaigns/all'], { relativeTo: this._activatedRoute });
       
    }

    cancel() {
        this.previewClicked = false;
        
        this._router.navigate(['/apps/campaigns/all'], { relativeTo: this._activatedRoute });
       
    }

    onFileSelected(files: FileList) {
        if (files) {
            var fileType = files[0].type;
            if (fileType.toLowerCase() == 'image/png' || fileType.toLowerCase() == 'image/jpg' || fileType.toLowerCase() == 'image/jpeg') {
                this.campaignForm.controls.step1.patchValue({
                    fileSource: files[0]
                });
            } else {
                // Error ::: file type is not correct
            }
        }
    }

    /**
     * Add a reference video field
     */
    addReferenceVideoField(): void {
        const referenceVideoFormGroup = this._formBuilder.group({
            video: ['', Validators.pattern(AppConstant.REGEX.URLL_REG)]
        });
        (this.campaignForm.get('step2').get('referenceVideo') as FormArray).push(referenceVideoFormGroup);
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove the reference video field
     *
     * @param index
     */
    removeReferenceVideoField(index: number): void {
        const referenceVideoFormArray = this.campaignForm.get('step2').get('referenceVideo') as FormArray;
        referenceVideoFormArray.removeAt(index);
        this.referenceVideos.splice(index, 1);
        this._changeDetectorRef.markForCheck();
    }

    dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], { type: mimeString });
    }

    postCampaign(actionType: string) {
        console.log("edit",this.editMode);
        
    //    if(actionType === "save"){
        // if(  this.userPlan===1 || this.data.liveCampaignsCount===1  && this.userPlan ===2 || this.data.liveCampaignsCount===2){
        //     // this.notification()
        //     this.CampLivenotification()
        //     // return

        // }
        let userDetail = JSON.parse(localStorage.getItem('userDetails'))
        let plans = userDetail.plan_id;
        let user = userDetail.userType
if (this.editMode===false) {
    if ((this.data.plan_id===1 || this.planDetails.campaigns === this.data.liveCampaignsCount ) &&
    ( this.data.plan_id===2 || this.planDetails.campaigns===  this.data.liveCampaignsCount) && (plans !=3)){
     this.CampLivenotification()
     return;
 }
}
      

    // }
        if (actionType === "save" && this.campaignForm.invalid) {
            if(this.campaignForm.get('step2').get('budget').value >=5000){
                this._notifyService.showError("Campaing price should be greater than zero.", 'error')
            }
            return;
        }

        let formValue = this.campaignForm.getRawValue();
        let campaign = { ...formValue.step1, ...formValue.step2, ...formValue.step3 };
        campaign.plateform = this.plateform;

        let brand_logo;

        // if (this.editMode) {
        //     console.log(this.campaignForm.get('step1').get('brand_logo').value);
        //     // brand_logo = btoa(this.selectedCampaign.brand_logo);
        //     const imageBlob = this.dataURItoBlob(this.campaignForm.get('step1').get('brand_logo').value);
        //     const imageFile = new File([imageBlob], this.campaignForm.get('step1').get('brand_name').value + "_logo", { type: 'image/png' });
        //     brand_logo = imageFile;
        // } else {
        //     const imageBlob = this.dataURItoBlob(this.campaignForm.get('step1').get('brand_logo').value);
        //     const imageFile = new File([imageBlob], this.campaignForm.get('step1').get('brand_name').value + "_logo", { type: 'image/png' });
        //     brand_logo = imageFile;
        // }

        if (this.campaignForm.get('step1').get('brand_logo').value) {
            if (this.campaignForm.get('step1').get('brand_logo').value.match(AppConstant.REGEX.URL_REG)) {
                brand_logo = this.campaignForm.get('step1').get('brand_logo').value;
            } else {
                const imageBlob = this.dataURItoBlob(this.campaignForm.get('step1').get('brand_logo').value);
                
                const imageFile = new File([imageBlob], this.campaignForm.get('step1').get('brand_name').value + "_logo", { type: 'image/png' });
                brand_logo = imageFile;
            }
        }

        let referenceVideo = "";
        this.campaignForm.get('step2').get('referenceVideo').value.forEach(element => {
            if (element.video !== "") {
                referenceVideo = (referenceVideo === "" ? "" : referenceVideo + ",") + element.video;
            }
        });

        // const formData = new FormData();
        // formData.append('brand_logo', brand_logo);
        // formData.append('plateform', 'youtube');
        // if(this.selectedCampaign.status==="3"){
        //     if(this.selectedCampaign.camp_title === this.campaignForm.get('step1').get('camp_title').value){
           
        // }
        // }

        let reskey  = (this.res[1] =='undefined') ? '' :this.res[1];
       console.log("campId",reskey);
       
        let type
        if (this.editMode) {
           if(this.selectedCampaign.plateform_type ===2){
            this.plateform='instagram'
           }
        }

        if( this.selectedCampaign?.id == reskey){
            type= 'edit'
            console.log("this.res[1]",this.res[1]);
            console.log("this.selectedCampaign?.id",this.selectedCampaign?.id);
            
        }else {
         type ='add';   
        }

        // let type = (this.selectedCampaign?.id) ? 'edit'  :'add';   
        // if(this.categories){
        // formData.append('category', this.categories?.toString());
        // }else{
        // formData.append('category', this.selectedTags?.toString());

        // }
       
        // formData.append('brand_name', this.campaignForm.get('step1').get('brand_name').value);
        // formData.append('brand_url', this.campaignForm.get('step1').get('brand_url').value);
        // formData.append('camp_title', this.campaignForm.get('step1').get('camp_title').value);
        // formData.append('camp_desc', this.campaignForm.get('step1').get('camp_desc').value);
        // formData.append('promot_product', this.campaignForm.get('step2').get('promot_product').value);
        // formData.append('duration', this.campaignForm.get('step2').get('duration').value !== 'Others'
        //     ? this.campaignForm.get('step2').get('duration').value
        //     : this.campaignForm.get('step2').get('new_duration').value);
        // formData.append('promotion_start', this.campaignForm.get('step2').get('promotion_start').value);
        // formData.append('reference_videos', referenceVideo);
        // formData.append('currency', this.campaignForm.get('step2').get('currency').value);
        // formData.append('budget', this.campaignForm.get('step2').get('budget').value);
        // // formData.append('category', this.categories?.toString());
        // // formData.append('category', this.selectedTags?.toString());
        // formData.append('visibility', this.campaignForm.get('step2').get('visibility').value);
        // // formData.append('invite_only', this.campaignForm.get('step2').get('invite_only').value);
        // formData.append('average_view', this.campaignForm.get('step3').get('average_view').value);
        // formData.append('subscriber', this.campaignForm.get('step3').get('subscriber').value);
        // formData.append('engagement_rate', this.campaignForm.get('step3').get('engagement_rate').value);
        // formData.append('type', actionType);
if(this.selectedCampaign?.category){
    this.addCampForm.controls.category.setValue(this.selectedCampaign?.category?.toString())

}else{
    this.addCampForm.controls.category.setValue(this.selectedTags?.toString())

}
     
console.log("selectedCampaign",this.selectedCampaign);

        this.addCampForm.controls.brand_logo.setValue(this.croppedImage)
        this.addCampForm.controls.id.setValue(this.selectedCampaign?.id)
        this.addCampForm.controls.plateform.setValue(this.plateform)
        this.addCampForm.controls.brand_name.setValue(this.campaignForm.get('step1').get('brand_name').value)
        this.addCampForm.controls.brand_url.setValue(this.campaignForm.get('step1').get('brand_url').value)
        this.addCampForm.controls.camp_title.setValue(this.campaignForm.get('step1').get('camp_title').value)
        this.addCampForm.controls.camp_desc.setValue(this.campaignForm.get('step1').get('camp_desc').value)
        this.addCampForm.controls.promot_product.setValue(this.campaignForm.get('step2').get('promot_product').value)
        this.addCampForm.controls.duration.setValue(this.campaignForm.get('step2').get('duration').value !== 'Others'? this.campaignForm.get('step2').get('duration').value : this.campaignForm.get('step2').get('new_duration').value)
        this.addCampForm.controls.promotion_start.setValue(this.campaignForm.get('step2').get('promotion_start').value)
        this.addCampForm.controls.reference_videos.setValue(referenceVideo)
        this.addCampForm.controls.currency.setValue(this.campaignForm.get('step2').get('currency').value)
        this.addCampForm.controls.budget.setValue(this.campaignForm.get('step2').get('budget').value)
        this.addCampForm.controls.visibility.setValue(this.campaignForm.get('step2').get('visibility').value)
        this.addCampForm.controls.average_view.setValue(this.campaignForm.get('step3').get('average_view').value)
        this.addCampForm.controls.subscriber.setValue(this.campaignForm.get('step3').get('subscriber').value)
        this.addCampForm.controls.engagement_rate.setValue(this.campaignForm.get('step3').get('engagement_rate').value)
        this.addCampForm.controls.followers.setValue(this.campaignForm.get('step3').get('followers').value)
        this.addCampForm.controls.inf_score.setValue(this.campaignForm.get('step3').get('inf_score').value)
        this.addCampForm.controls.type.setValue(actionType)

        // formData.append('campaign', new Blob([JSON.stringify(campaign)], { type: "application/json" }));
        console.log(this.editMode,'editmode');
        console.log("this.addCampForm.value",this.addCampForm.value);
        // console.log("payload",payload);
        
        this._campaignsService.postCampaign(this.addCampForm.value, this.editMode).subscribe(
            data => {
              

                this.campaignForm.get('step1').get('camp_title').patchValue(null);
                
                this._notifyService.showSuccess(data.message, "");
               
                // if(this.editMode===true){
                //  this._router.navigate(['/apps/campaigns/all'])

                // }else{
                // this._router.navigate(['/camplive']) ;

                // }
                if(actionType !='draft'){
                    if(this.editMode !=true){
                        this._campaignsService.setLiveCampData(data)
                        this._router.navigate(['/camplive']) ;
                //  this._router.navigate(['/apps/campaigns/all'])
                    }else{
                    this.navigatePath= this._router.navigate(['/apps/campaigns/all'])

                    }
               
                }else{
            
                    this._router.navigate([this.navigatePath])
                }

                // if(data.message ==='Please upgrade to create more than one live campaign..'){
                //     this._router.navigate(['/choose-plan'])
                    
                // }
                // else{
                //     this._router.navigate(['/choose-plan'])

                    
                // }
                // this._notifyService.showError(data.message, "error");
    //    console.log("formData",formData);
                // window.location.reload()
              this.campaignForm.reset()
              this.addCampForm.reset()
            //   this.selectedCampaign=Campaign
        this.addCampForm.controls.id.setValue('')
        this.addCampForm.controls.brand_logo.setValue('')
        this.addCampForm.controls.plateform.setValue('')
        this.addCampForm.controls.type.setValue('')


              console.log("addCampForm",this.addCampForm.value);
              
            //     if (actionType === "save" && this.userPlan === 3 && this.revealedChannels===0) {
            //   this.campaignForm.reset()
                  
            //         // open Invite campaign popup
            //         this.inviteUserForCampaign(data['payload']);
            //     } else {
            //         // this._router.navigate([this.nextStateRoute])

            //         this.navigateToNextStep();
            //         console.log("this.navigateToNextStep()",this.navigateToNextStep());
                    
            //     }
            
           
        }
        );

    }
  
   

    inviteUserForCampaign(campaign) {
        const inviteCampaignPopup = this._matDialog.open(InviteCampaignPopupComponent, {
            autoFocus: false,
            disableClose: true,
            data: {
                campaign: campaign,
                influencers: []
            }
        });

        inviteCampaignPopup.afterClosed().subscribe((result) => {
            this.navigateToNextStep();
        });
    }

    navigateToNextStep() {
        let nextState = this.nextStateRoute ? this.nextStateRoute : '/apps/campaigns/all';
        this._router.navigate([nextState]);
    }

    ngOnDestroy(): void {
        // // Unsubscribe from all subscriptions
        // this._unsubscribeAll.next();
        // this._unsubscribeAll.complete();
    }

    openCategoryPopup() {
        let selectedValues = [];
        if (this.selectedCampaign) {
            selectedValues = this.selectedCampaign.category;
        } else {
            selectedValues = this.selectedTags;
        }
        let categoriesData;

        this._campaignsService.getCategoryList().subscribe((data) => {
            if (data.success) {
                categoriesData = data.payload;
                const selectCategoryPopup = this._matDialog.open(SelectCategoryPopupComponent, {
                    autoFocus: false,
                    data: {
                        allCategories: categoriesData,
                        selectedCategories: selectedValues
                    }
                });

                selectCategoryPopup.afterClosed().subscribe((result) => {
                    console.log("result",result);
                    
                    if (this.selectedCampaign) {
                        if(result !=null){
                            let cat=result
                            this.selectedCampaign.category = cat;
                            // this.selectedCampaign.category = result;
                            console.log("this.selectedCampaign.category",this.selectedCampaign.category);
                        }
                        // let cat=result
                        // this.selectedCampaign.category = cat;
                        // this.selectedCampaign.category = result;
                        console.log("this.selectedCampaign.category",this.selectedCampaign.category);
                        this.secondNextButtonClicked();
                        
                    } else {
                        this.selectedTags = result;
                        this.secondNextButtonClicked();
                        console.log("this.selectedTags.category",this.selectedTags);
                    }
                    this._changeDetectorRef.markForCheck();
                });
            }
        });
    }

    onAverageViewsChange() {
        // if(this.data.plan_id!=3 && this.data.plan_id==2 || this.data.plan_id==1){
        //     this.Openmodel()
        // }else{
            this.secondNextButtonClicked();
        // }
       
    }

    onSubscribersChange() {
        this.secondNextButtonClicked();
    }

    onFollowersChange() {
        
        this.secondNextButtonClicked();
    }
    
    onInfluencerScoreChange() {
        this.secondNextButtonClicked();
    }

    onEngagementRateChange(event) {
        console.log("onEngagementRateChange",event);
        this.campaignForm.get('step3').get('engagement_rate').setValue(event.value)
        
        this.secondNextButtonClicked();
    }

}

@Component({
    selector: 'dialog-overview-example-dialog',
    template: `
    <div mat-dialog-content>
      <p style="text-align: center;
      margin-top: 4px;
      font-size: 18px;
      font-weight:bold;">You're about to create a new campaign with exactly the same title as an ongoing campaign.<br> Are you sure you want to proceed?</p>
 
    </div>
    <div mat-dialog-actions style="text-align:center">
    <button type="button" class="btn btn-success m-3" (click)="yes(true)">Yes</button>
      <button type="button" class="btn btn-danger m-3" (click)="onNoClick(false)">Cancel</button>
    </div>`,
  })
  export class DialogOverviewExampleDialog {
    constructor(
      public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
      @Inject(MAT_DIALOG_DATA) public data,
    ) {}
  
    onNoClick(val:any): void {
      this.dialogRef.close(val);
    }


  
    yes(val:any): void {
        this.dialogRef.close(val);     
      }
    }