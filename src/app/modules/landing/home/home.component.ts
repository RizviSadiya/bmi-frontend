import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';

import { LandingPageService } from '../landing-page.service';

@Component({
    selector: 'landing-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LandingHomeComponent {
    influencersList = [];
    minLength: number = 3;
    searchControl: FormControl = new FormControl();
    errorMessage: string = null;
    noDataFound: boolean = false;
    id: any;
    hash: any;
    public slides = [
        { src: "assets/images/team/team-01.jpg" },
        { src: "assets/images/team/team-02.jpg" }
    ];

    /**
     * Constructor
     */
    images:any
    constructor(private _landingPageService: LandingPageService,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _router: Router,
) {
    // this.images= this._landingPageService.image
    console.log("image",this.images);
    
    this.id =localStorage.getItem('userDetails.id') ;
    this.hash =localStorage.getItem('userDetails.email_verified_token') ;
    console.log("id,hash",this.id,this.hash);



     }

    searchInfluencers() {
        this.noDataFound = false;
        let searchValue = this.searchControl.value;
        if (searchValue && searchValue.length >= this.minLength) {
            this.errorMessage = null;
            let payload = { search_keyword: searchValue };
            this._landingPageService.getChannelList(payload).subscribe(data => {
                if (data.success) {
                    this.influencersList = data.payload.channel_list;
                    if (this.influencersList.length === 0) {
                        this.noDataFound = true;
                    } else {
                        this.noDataFound = false;
                    }
                } else {
                    this.influencersList = [];
                }
            });
        } else {
            this.errorMessage = "min. length must be 3";
        }
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
