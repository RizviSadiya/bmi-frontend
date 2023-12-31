import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { bmiAnimations } from '@bmi/animations';
import { BmiAlertType } from '@bmi/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector     : 'auth-forgot-password',
    templateUrl  : './forgot-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : bmiAnimations
})
export class AuthForgotPasswordComponent implements OnInit
{
    @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;

    alert: { type: BmiAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    forgotPasswordForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private route:Router,
        private toastrService:ToastrService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Send the reset link
     */
    sendResetLink(): void
    {
//         // Return if the form is invalid
        if ( this.forgotPasswordForm.invalid )
        {
            return;
        }

        // Disable the form
        this.forgotPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;
            let payload={
    "email":this.forgotPasswordForm.value.email
}
        // Forgot password
        this._authService.forgotpasswordemail(payload)
            .pipe(
                finalize(() => {

                    // Re-enable the form
                    this.forgotPasswordForm.enable();

                    // Reset the form
                    this.forgotPasswordNgForm.resetForm();

                    // Show the alert
                    this.showAlert = true;

                })
            )
            .subscribe(
                (response) => {
                    // this.toastrService.success(response.message)
                    // Set the alert
                    this.alert = {
                        type   : 'success',
                        message: 'Password reset sent! You\'ll receive an email if you are registered on our system.'
                    };
                    
                    // this.route.navigate(['/reset-password'])
                },
                (response) => {

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'You are not authorize to do this action'
                        // message: 'Email does not found! Are you sure you are already a member?'
                    };
                }
            );


//   Return if the form is invalid
//         if ( this.forgotPasswordForm.invalid )
//         {
//             return;
//         }

//         // Disable the form
//         this.forgotPasswordForm.disable();

//         // Hide the alert
//         this.showAlert = false;
//             let payload={
//     "email":this.forgotPasswordForm.value.email
// }
//         // Forgot password
//         this._authService.forgotpasswordemail(payload).subscribe(res=>{
//             if(res){
//                 alert(res)
//             }
//         })
    }
}
