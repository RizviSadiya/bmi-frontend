import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { bmiAnimations } from '@bmi/animations';
import { BmiAlertType } from '@bmi/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { NotificationService } from 'app/core/services/notification.service';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: bmiAnimations
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: BmiAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _notifyService: NotificationService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            rememberMe: ['']
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._authService.signIn(this.signInForm.value)
            .subscribe(
                (data) => {
                    console.log("data.payload.status",data.payload.status);
                     localStorage.setItem('userDetails', JSON.stringify(data.payload));
                    
                    if (data.payload.status === 1) {
                        // Set the redirect url.
                        // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                        // to the correct page after a successful sign in. This way, that url can be set via
                        // routing file and we don't have to touch here.
                        const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                        // console.log("redirectURL", redirectURL);
                        
                        // Navigate to the redirect url
                    localStorage.setItem("userType", JSON.stringify(data?.payload.userType))

                        this._router.navigateByUrl(redirectURL);
                    console.log("data.payload.status",data.payload.userType);

                        window.location.reload();
                    }else if(data.payload.status === 3){

                        this._router.navigateByUrl('/email-verification');
                        this._notifyService.showWarning(data.message, '');

                    }
                     else {
                        
                        this._router.navigateByUrl('/signup');
                        this._notifyService.showWarning(data.message, '');
                    }  
                },
                (error) => {
                    console.log("error",error);
                    
                    // Re-enable the form
                    this.signInForm.enable();
                    // Reset the form
                    this.signInNgForm.resetForm();
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

    googleLogin() {
        this._authService.loginWithGoogle();
    }
}
