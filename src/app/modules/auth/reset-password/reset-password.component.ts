import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { bmiAnimations } from '@bmi/animations';
import { BmiValidators } from '@bmi/validators';
import { BmiAlertType } from '@bmi/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { Router } from '@angular/router';
@Component({
    selector     : 'auth-reset-password',
    templateUrl  : './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : bmiAnimations
})
export class AuthResetPasswordComponent implements OnInit
{
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;

    alert: { type: BmiAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    resetPasswordForm: FormGroup;
    showAlert: boolean = false;
    resetLink:any
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router:Router
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
        this.resetPasswordForm = this._formBuilder.group({
                password       : ['', Validators.required],
                passwordConfirm: ['', Validators.required]
            },
            {
                validators: BmiValidators.mustMatch('password', 'passwordConfirm')
            }
        );
        // let value = window.location.href
        let value =this._router.url
                console.log("value",value);
                this.resetLink = value.split('reset-password/');
                console.log('resetLink', this.resetLink[1]);
            
                
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    resetPassword(): void
    {
        // Return if the form is invalid
        if ( this.resetPasswordForm.invalid )
        {
            return;
        }

        // Disable the form
        // this.resetPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;
        // let value = window.location.href 
        // console.log("value",value);
        // var res = value.split('/');
        // console.log('res', res[1]);

       let payload={
        "password":this.resetPasswordForm.value.password,
        "token":this.resetLink[1],
        // token:"u88qGlIdJtanBtm2PFdAQfYkG1JGLzYWolx8rvL1qASJAw5r7osBKjQRTYTx3NkO"

    }
        console.log("payload",payload);
        
        // Send the request to the server
         this._authService.passwordreset(payload).subscribe(res=>{
            if(res){
              console.log("success",res);
              this._router.navigate(['/sign-in'])
            }
         })
    //     this._authService.passwordreset(payload)
    //         .pipe(
    //             finalize(() => {

    //                 // Re-enable the form
    //                 this.resetPasswordForm.enable();

    //                 // Reset the form
    //                 this.resetPasswordNgForm.resetForm();

    //                 // Show the alert
    //                 this.showAlert = true;
    //             })
    //         )
    //         .subscribe(
    //             (response) => {

    //                 // Set the alert
    //                 this.alert = {
    //                     type   : 'success',
    //                     message: 'Your password has been reset.'
    //                 };
    //             },
    //             (response) => {

    //                 // Set the alert
    //                 this.alert = {
    //                     type   : 'error',
    //                     message: 'Something went wrong, please try again.'
    //                 };
    //             }
    //         );
    // }
}
changepassword(){
    // let payload={
    //     "password":this.resetPasswordForm.value.password,
    //     "token":this.resetLink[1],
    //     // token:"u88qGlIdJtanBtm2PFdAQfYkG1JGLzYWolx8rvL1qASJAw5r7osBKjQRTYTx3NkO"

    // }
    // console.log("payload",payload);
    // this._authService.passwordreset(payload).subscribe(res=>{
    //                 if(res){
    //                   console.log("success",res);
                      
    //                 }
    //              })
}
}