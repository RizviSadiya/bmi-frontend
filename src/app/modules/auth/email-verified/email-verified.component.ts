import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { bmiAnimations } from '@bmi/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'email-verified',
    templateUrl: './email-verified.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: bmiAnimations
})
export class EmailVerifiedComponent implements OnInit {
    id: any;
    hash: any;
    token: any;
    errorMsg: string = null;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _router: Router,

    ) {
    }

    ngOnInit(): void {
    console.log("this._router.url",this._router.url);
    
        let value = window.location.href
        console.log("tokenvalue",value)
        this.id = this._activatedRoute.firstChild?.snapshot.params['id'];
        this.hash = this._activatedRoute.firstChild?.snapshot.params['hash'];
        this.token = this._activatedRoute.firstChild?.snapshot.params['token'];
  console.log("this._activatedRoute.firstChild?.snapshot.params['id'];",this._activatedRoute.firstChild?.snapshot.params['id']);
  console.log("this._activatedRoute.firstChild?.snapshot.params['hash'];",this._activatedRoute.firstChild?.snapshot.params['hash']);
  console.log("hash+token", this.hash)
        if (this.id && this.hash) {
            this._authService.emailVerification(this.id,this.hash).subscribe(data => {
                if(data){
                    console.log("response",data['payload']);
                
                    localStorage.setItem('userDetails', JSON.stringify(data['payload']));
                    localStorage.setItem('accessToken', data['payload'].access_token);
                    
                    // this._router.navigateByUrl('/signup');
                }
                this.errorMsg = null;
              
            },
            error => {
                this.errorMsg = error.message;
            });
        } else {
            this.errorMsg = "Confirm your Email!";
        }
    }
}
