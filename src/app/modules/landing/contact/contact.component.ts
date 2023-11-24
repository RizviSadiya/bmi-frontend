import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BmiAlertType } from '@bmi/components/alert';
import { bmiAnimations } from '@bmi/animations';

import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'landing-contact',
    templateUrl: './contact.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: bmiAnimations
})
export class LandingContactComponent implements OnInit {
    alert: { type: BmiAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    contactForm: FormGroup;
    showAlert: boolean = false;
    submitted: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _authService: AuthService
        ) {
    }

    /**
     * On init
     */
     ngOnInit(): void {
        // Create the form
        this.contactForm = this._formBuilder.group({
            fullname: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            who_are_you: ['', Validators.required],
            skype_whats_app: ['', Validators.required],
            message: ['', Validators.required]
        });
    }

    sendMessage() {
        this.submitted = true;
        if (this.contactForm.invalid) {
            return;
        }
        this.showAlert = false;

        this._authService.submitContactForm(this.contactForm.value).subscribe(data => {
            this.alert = {
                type: 'success',
                message: data['message']
            };
            this.showAlert = true;
            this.submitted = false;
            this.contactForm.reset();
        },
        error => {
            this.alert = {
                type: 'error',
                message: 'Something went wrong'
            };
            this.showAlert = true;
        });
    }
}
