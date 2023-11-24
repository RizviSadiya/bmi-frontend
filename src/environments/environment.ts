// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// import { NavigationService } from "app/core/navigation/navigation.service";

// export class environments{
//     url:any
//     constructor(private navigation: NavigationService)
//     {
//         this.url= this.navigation.get_url()
//         console.log("enviroment",this.url);
        
//     }
// }
export const environment = {
    
    production: false,
    // API_BASE_ENDPOINT: "https://3mad.in/bmi/",
    API_BASE_ENDPOINT: "https://stage-api.bookmyinfluencers.com/",
    CHAT_ENDPOINT: "wss://stage-api.bookmyinfluencers.com/chat-wss/",
    PUBLIC_URL: "api/v1/",
    PUBLIC_URL_V2: "api/v2/",
    URL_V2: "api/v2/",
    INFLUENCER_URL: "api/v1/" + (JSON.parse(localStorage.getItem('userDetails')) ? JSON.parse(localStorage.getItem('userDetails')).userType : '') + "/",
    // // INFLUENCER_URL: "api/v1/influencer/" ,
    // INFLUENCER_URL: "api/v1/" + (JSON.parse(localStorage.getItem('userType'))) + "/",
    // // INFLUENCER_URL: "api/v1/" + this.url + "/",

    BRAND_URL: "api/v1/brand/",
    GOOGLE_CLIENT_ID: "490682266510-eqjietfun6el6km4kegnjo5dced91jf5.apps.googleusercontent.com",
    VERSION: "1.1.1-dev"
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
