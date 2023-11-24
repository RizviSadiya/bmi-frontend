import { Component, OnInit, ViewChild,Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup,FormControl, NgForm, Validators } from '@angular/forms';

import { bmiAnimations } from '@bmi/animations';
import { BmiAlertType } from '@bmi/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { AppConstant } from 'app/app.constants';
import { AddChannelService } from 'app/modules/admin/apps/add-channel/add-channel.service';
import { NotificationService } from 'app/core/services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
// import { error } from 'console';
@Component({
    selector: 'auth-sign-up-step-two',
    templateUrl: './sign-up-step-two.component.html',
    styleUrls: ['./sign-up-step-two.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: bmiAnimations
})
export class AuthSignUpStepTwoComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: BmiAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signUpForm: FormGroup;
    showAlert: boolean = false;
    submitted: boolean = false;
    userType: string;
    selectedEmail: string = null;
    allChannels:any
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _channelService:AddChannelService, 
         private _activatedRoute: ActivatedRoute,
         private notification:NotificationService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    userChannels:any
   all_Channels:any
    ngOnInit(): void {
        this._activatedRoute.queryParams.subscribe(res=>{
            console.log("sadiya",res)
            // let socialUser = JSON.parse(localStorage.getItem("socialUser"));
            // console.log("socialUser",socialUser)

        })
        let googleUser = localStorage.getItem("email") ? localStorage.getItem("email") : null;
            console.log("googleUser",googleUser);
            
        if(googleUser) {    
            // this._authService.getUserInfo(googleUser).subscribe((res)=>{
            //     console.log(res,'aa');
            //     if(res){
            //         this.userChannels =res
            //     }
            // })
            this.allChannels= localStorage.getItem("allChannels")
            // this.allChannels= JSON.parse(localStorage.getItem("allChannels"))
            console.log("allChannels",this.allChannels);

            this._router.navigateByUrl('/signup');
        }
        let socialUser
        // if(JSON.parse(localStorage.getItem("userDetails")) !=undefined){
         socialUser = JSON.parse(localStorage.getItem("userDetails"));

        // }
        // let socialUser = JSON.parse(localStorage.getItem("userDetails"));
        console.log(socialUser);
        let userInfo:any={email:socialUser?.email}
        // let userInfo:any={email:googleUser}
        this._authService.getUserInfo(userInfo).subscribe((res)=>{
            console.log(res,'aa');
            if(res){
                this.userChannels =res
            }
        })
                 this.filteredOptions= this.userChannels?.payload.all_channels
        this.userType = socialUser && socialUser.userType ? socialUser.userType : undefined;
        let accessToken = localStorage.getItem("accessToken") ? localStorage.getItem("accessToken") : undefined;
            this._router.navigateByUrl('/signup');
        if(!accessToken) {
            // this._router.navigateByUrl('/sign-up');
            this._router.navigateByUrl('/signup');

        }
        if(accessToken===undefined && socialUser?.status ===3) {
            this._router.navigateByUrl('/signup');
        }
        // Create the form
        this.signUpForm = this._formBuilder.group({
            name: [socialUser && socialUser?.name ? socialUser?.name : '', [Validators.required, Validators.pattern(AppConstant.REGEX.NAME_REG)]],
            phone: [''],
            skype: [''],
            // channel_url: [socialUser && socialUser.channel ? socialUser.channel : ''],
            channel_url: [''],
            language: [socialUser && socialUser.lang ? socialUser.lang : ''],
            currency: ['INR'],
            promotion_price: [socialUser && socialUser.price ? socialUser.price : '',[Validators.pattern(AppConstant.REGEX.promotion_price)]],
            detail_in_exchange: [true],
            whats_app_notification: [true]
        });

        // if(JSON.parse(localStorage.getItem("userDetails"))){
        //     let socialUser = JSON.parse(localStorage.getItem("userDetails"));
        //     console.log(socialUser);
        //     let userInfo:any={email:socialUser.email}
        //     this._authService.getUserInfo(userInfo).subscribe((res)=>{
        //         console.log(res,'aa');
        //         if(res){
        //             this.userChannels =res
        //         }
        //     })
        //     this.filteredOptions= this.userChannels.payload.all_channels
        //     this.userType = socialUser && socialUser.userType ? socialUser.userType : undefined;
        //     let accessToken = localStorage.getItem("accessToken") ? localStorage.getItem("accessToken") : null;
        //     if(!accessToken) {
        //         this._router.navigateByUrl('/sign-up');
        //     }
        //     this.signUpForm = this._formBuilder.group({
        //         name: [socialUser && socialUser.name ? socialUser.name : '', [Validators.required, Validators.pattern(AppConstant.REGEX.NAME_REG)]],
        //         phone: [''],
        //         skype: [''],
        //         channel_url: [socialUser && socialUser.channel ? socialUser.channel : ''],
        //         language: [socialUser && socialUser.lang ? socialUser.lang : 'Hindi'],
        //         currency: ['INR'],
        //         promotion_price: [socialUser && socialUser.price ? socialUser.price : ''],
        //         detail_in_exchange: [true],
        //         whats_app_notification: [true]
        //     });
        // }else{
        //     let socialUser = JSON.parse(localStorage.getItem("socialUser"));
        //     console.log(socialUser);
        //     let userInfo:any={email:socialUser.email}
        //     this._authService.getUserInfo(userInfo).subscribe((res)=>{
        //         console.log(res,'aa');
        //         if(res){
        //             this.userChannels =res
        //         }
        //     })
        //     this.filteredOptions= this.userChannels.payload.all_channels
        //     this.userType = socialUser && socialUser.userType ? socialUser.userType : undefined;
        //     let accessToken = localStorage.getItem("accessToken") ? localStorage.getItem("accessToken") : null;
        //     if(!accessToken) {
        //         this._router.navigateByUrl('/sign-up');
        //     }
        //     this.signUpForm = this._formBuilder.group({
        //         name: [socialUser && socialUser.name ? socialUser.name : '', [Validators.required, Validators.pattern(AppConstant.REGEX.NAME_REG)]],
        //         phone: [''],
        //         skype: [''],
        //         channel_url: [socialUser && socialUser.channel ? socialUser.channel : ''],
        //         language: [socialUser && socialUser.lang ? socialUser.lang : 'Hindi'],
        //         currency: ['INR'],
        //         promotion_price: [socialUser && socialUser.price ? socialUser.price : ''],
        //         detail_in_exchange: [true],
        //         whats_app_notification: [true]
        //     });
        // }
        console.log("signUpForm",this.signUpForm.value);
        // this.onKeydown(event)
        
    }

    selectUserType(type: string) {
        this.userType = type;
        const name = this.signUpForm.get("name");
      const promotionPrice = this.signUpForm.get("promotion_price");

        name.setValidators([Validators.required, Validators.pattern(AppConstant.REGEX.NAME_REG)]);

       promotionPrice.setValidators([Validators.required]);
    //    promotionPrice.setValidators([Validators.required, Validators.pattern(AppConstant.REGEX.promotion_price)]);
        name.updateValueAndValidity();
        if (type === 'influencer') {
            const phone = this.signUpForm.get("phone");
            const channelUrl = this.signUpForm.get("channel_url");
            const language = this.signUpForm.get("language");
            const currency = this.signUpForm.get("currency");
            // const promotionPrice = this.signUpForm.get("promotion_price");
            // const detailinexchange = this.signUpForm.get("detail_in_exchange");

            phone.setValidators([Validators.required, Validators.pattern(AppConstant.REGEX.MOBILE_REG)]);
            // channelUrl.setValidators([Validators.required, Validators.pattern(AppConstant.REGEX.NAME_REG)]);
            language.setValidators([Validators.required]);
            currency.setValidators([Validators.required]);
            // promotionPrice.setValidators([Validators.required, Validators.pattern(AppConstant.REGEX.NUMBER_WITH_DECIMAL_REG)]);

            phone.updateValueAndValidity();
            channelUrl.updateValueAndValidity();
            language.updateValueAndValidity();
            currency.updateValueAndValidity();
            // promotionPrice.updateValueAndValidity();
        } else {
            const phone = this.signUpForm.get("phone");
            const currency = this.signUpForm.get("currency");
            const skype = this.signUpForm.get("skype");

            // phone.setValidators([Validators.required, Validators.pattern(AppConstant.REGEX.MOBILE_REG)]);
            currency.setValidators([Validators.required]);

            // phone.updateValueAndValidity();
            currency.updateValueAndValidity();
        }
    }

    resetInfluencerFormValidity() {
        const phone = this.signUpForm.get("phone");
        const channelUrl = this.signUpForm.get("channel_url");
        const language = this.signUpForm.get("language");
        const currency = this.signUpForm.get("currency");
        const promotionPrice = this.signUpForm.get("promotion_price");

        phone.setValidators(null);
        channelUrl.setValidators(null);
        language.setValidators(null);
        currency.setValidators(null);
        promotionPrice.setValidators(null);

        phone.updateValueAndValidity();
        channelUrl.updateValueAndValidity();
        language.updateValueAndValidity();
        currency.updateValueAndValidity();
        promotionPrice.updateValueAndValidity();
    }

    resetBrandFormValidity() {
        const phone = this.signUpForm.get("phone");
        const currency = this.signUpForm.get("currency");

        phone.setValidators(null);
        currency.setValidators(null);

        phone.updateValueAndValidity();
        currency.updateValueAndValidity();
    }

    signUp(): void {
        this.submitted = true;
        // Do nothing if the form is invalid
        if (this.signUpForm.invalid) {
            console.log("signUpForm",this.signUpForm)
            return;
        }
        if(this.signUpForm.get("promotion_price").value > 10000000){
            this.notification.showError("price should be 1 crore or less than 1 crore", 'error')
            return;

        }
        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;

        let payload = { ...this.signUpForm.value, "usertype": this.userType };
        console.log("payload",payload);
        // Sign up
        this._authService.signUpPhaseTwo(payload)
            .subscribe(
                (response) => {
                    console.log(response);
                    if (response.payload.userType === "brand") {
                        // Navigate to the confirmation required page
                        // this._router.navigateByUrl('/choose-plan');

                         this._router.navigate(['/dashboard'])

                    } else {
                        // Navigate to the redirect url
                localStorage.setItem('userDetails', JSON.stringify(response.payload));

                        this._router.navigateByUrl('/signed-in-redirect');
                        window.location.reload();
                    }
                },
                (error) => {
                    // Re-enable the form
                    this.signUpForm.enable();

                    // Reset the form
                    this.signUpForm.reset();
                    this.signUpForm.patchValue({
                        language: 'Hindi',
                        currency: 'INR'
                    });
                    this.resetInfluencerFormValidity();
                    this.resetBrandFormValidity();
                    this.userType = null;

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: error
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );
    }

    googleSignUp() : void {

    }


        //auto search start
        opened: boolean = false;
        channel_link: FormControl = new FormControl();
        @Input() appearance: 'basic' | 'bar' = 'basic';
        @Input() minLength: number = 3;
        filteredOptions;
        keyupValue:any
        onKeydown(event: KeyboardEvent): void {
            // Listen for escape to close the search
            // if the appearance is 'bar'
            console.log("event",event)
            let keyValue = event.key
            console.log("keyValue",keyValue)
           
           
            let obj={
                "search_keyword":event
            }
            this._channelService.autoSuggestChannelList(obj).subscribe(res=>{
                if (res.code==200){
                    this.filteredOptions= res.payload.channel_list
                    // console.log("filteredOptions",this.filteredOptions);
                    
                }
            })
           
            if (this.appearance === 'bar') {
    
                // Escape
                if (event.code === 'Escape') {
                    // Close the search
                    this.close();
                }
            }
        }

        onResultSelection(e) {
            this.channel_link.setValue(e);
            // this._router.navigate(['/apps/influencers', e]);
            // console.log("esssssssssssss", e);
            // this.addChannelForm.controls.channel_link.setValue(this.channel_link)
            // console.log("channel_link", this.channel_link);
            
        }
        close(): void {
            // Return if it's already closed
            if (!this.opened) {
                return;
            }
        }

        onEnter() {
            console.log(this.channel_link.value);
            let searchValue = this.channel_link.value;
            // console.log("searchValueonEnter", searchValue);
            // if (searchValue.length >= this.minLength) {
            //     this._router.navigate(['/apps/influencers', searchValue]);
            // }
        }
}
