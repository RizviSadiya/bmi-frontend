import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

import { LandingPageService } from '../landing-page.service';

@Component({
    selector: 'landing-influencer',
    templateUrl: './influencer.component.html',
    styleUrls: ['./influencer.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LandingInfluencerComponent {
    influencersList = [];
    minLength: number = 3;
    searchControl: FormControl = new FormControl();
    errorMessage: string = null;
    noDataFound: boolean = false;
    faqCategories = [
        {
            id: 1,
            question: "WHAT DO I NEED TO BE A PART OF BOOKMYINFLUENCERS?",
            answer: "There are no stringent requirements, if you have a social media account on Facebook, Instagram, Youtube, Snapchat or Twitter with at least 1k followers, you are eligible to create an account"
        },
        {
            id: 2,
            question: "HOW DO I CREATE MY PROFILE ON BMI?",
            answer:"While you sign up, you will be asked a few details with which we create your basic profile, then you can either follow the step-by-step video guide that will be available to you or just follow simple instructions on the page to complete your profile"
        },
        {
            id: 3,
            question: "CAN BRANDS CONTACT ME DIRECTLY?",
            answer:"Yes, apart from creating campaigns, brands also have the option to explore our influencer network. If they land on your profile and find your profile interesting, they have an option to DM you to initiate the conversation."
        },
        {
            id: 4,
            question: "HOW DO I GET PAID THROUGH THIS PLATFORM",
            answer:"Yes, apart from creating campaigns, brands also have the option to explore our influencer network. If they land on your profile and find your profile interesting, they have an option to DM you to initiate the conversation."
        },
        {
            id: 5,
            question: "DO I HAVE TO PAY ANY CHARGES FOR CREATING A PROFILE?",
            answer:"BMI is completely free for social media influencers to use, there are zero charges for registration and exploring the platform."
        },
        {
            id: 6,
            question: "HOW CAN I COMMUNICATE WITH THE BRANDS?",
            answer:"You have an option to go on the “Campaigns Page” on your profile and explore campaigns you want to be a part of or click on notification for campaigns you are eligible for. Once, the brand sees your response, they’ll start the discussions with you."
        },
        {
            id: 7,
            question: "WHAT ALL DETAILS WILL MY BUSINESS PROFILE HAVE?",
            answer:"You business profile will showcase your top grossing videos, latest promotions, other social media channels and various graphs and analytics that will work as your channel portfolio as well"
        },
        {
            id: 8,
            question: "WHAT ALL DETAILS WILL MY BUSINESS PROFILE HAVE?",
            answer:"We have taken extreme caution to safeguard payments through our platform to ensure we take care of interests of both the brand and the influencer."
        }
    ];
    public slides = [
        { src: "assets/images/team/team-01.jpg" },
        { src: "assets/images/team/team-02.jpg" }
    ];

    /**
     * Constructor
     */
    images:any
    constructor(private _landingPageService: LandingPageService) {
        // this.images= this._landingPageService.image
        console.log("image",this.images);
        
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
     trackByFn(index: number, item: any): any
     {
         return item.id || index;
     }
}
