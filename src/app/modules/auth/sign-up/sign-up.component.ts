import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { bmiAnimations } from '@bmi/animations';
import { BmiAlertType } from '@bmi/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { AppConstant } from 'app/app.constants';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: bmiAnimations
})
export class AuthSignUpComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: BmiAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signUpForm: FormGroup;
    showAlert: boolean = false;
    submitted: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private toastrService: ToastrService,
        private _activatedRoute: ActivatedRoute,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._activatedRoute.queryParams.subscribe(res=>{
            console.log("sadiya",res)
        })
        // Create the form
        this.signUpForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.pattern(AppConstant.REGEX.PASSWORD_REG)]],
            agreements: ['', Validators.requiredTrue]
        });
    }

    checkAndValidateEmail(): void {
        this.submitted = true;
        if (this.signUpForm.invalid) {
            return;
        }
        this.signUpForm.disable();
        this.showAlert = false;

        this.signUp();

        // The below code once email is verified from server
        // this.signUpForm.enable();
        // this.submitted = false;
    }

    signUp(): void {
        this.submitted = true;
        // Do nothing if the form is invalid
        if (this.signUpForm.invalid) {
            return;
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign up
        this._authService.signUpPhaseOne(this.signUpForm.value)
            .subscribe(
                (response) => {
                    console.log(response);
                    this.submitted = false;
                    if(response.status===3) {
                      this.toastrService.success( response.message,'success') 
                        // this._router.navigateByUrl('/signup');
                        // const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/email-verification';
                        console.log("this._activatedRoute.snapshot.queryParamMap.get('redirectURL')",this._activatedRoute.snapshot.queryParamMap.get('redirectURL'));
                        
                        // // Navigate to the redirect url
                        // this._router.navigateByUrl(redirectURL);
                        // this._router.navigateByUrl('/email-verification');

                        // console.log("redirectURL",redirectURL)
                        // console.log("this._activatedRoute.firstChild?.snapshot.params",this._activatedRoute.firstChild?.snapshot.params)
                    }else if(response.payload.status === 3){
                        this.submitted = false;

                        // this._router.navigateByUrl('/signup');
                        this._router.navigateByUrl('/email-verification');
                        this.toastrService.success(response.message, '');

                    }
                },
                (error) => {
                    this.submitted = false;
                    // Re-enable the form
                    this.signUpForm.enable();

                    // Reset the form
                    this.signUpForm.reset();

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
        this._authService.loginWithGoogle();
    
    }
}
