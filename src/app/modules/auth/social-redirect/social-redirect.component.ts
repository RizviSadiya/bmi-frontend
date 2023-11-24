import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { bmiAnimations } from '@bmi/animations';
import { SettingsService } from 'app/modules/admin/pages/settings/settings.service';

@Component({
    selector: 'auth-social-redirect',
    templateUrl: './social-redirect.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: bmiAnimations
})
export class SocialRedirectComponent implements OnInit {
    socialProvider: string = null;
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _settingsService: SettingsService) {
    }
    channelList:any
    ngOnInit(): void {
        // this.socialProvider = this._activatedRoute.firstChild?.snapshot.params['provider'];
        // console.log("Provider is :::: " + this.socialProvider);

        this._activatedRoute.queryParams.subscribe(data => {
            // console.log("sadiya",data);
            if(data['channel_data'] && data['channel_data'] !='%5B%5D' && data['channel_data'] ==null){

            // if(data['channel_data']){
                console.log("if data",data);

                this.channelList= data['channel_data'];
                // this.channelList= JSON.parse(data['channel_data']);
                console.log("if channel",this.channelList);

            }else{
                console.log("elsedata",data);
                
                // this.channelList=[]
                console.log("else channel",this.channelList);

            }
          
          
            // const uri = data['channel_data'];
            // const encoded = encodeURI(uri);
            // console.log("encoded",encoded);
            // expected output: "https://mozilla.org/?x=%D1%88%D0%B5%D0%BB%D0%BB%D1%8B"
            
            // try {
            //   console.log(decodeURI(data['channel_data']));
            //   // expected output: "https://mozilla.org/?x=шеллы"
            //   let channel=JSON.stringify(decodeURI(data['channel_data']))
            //   let channelURL=JSON.parse(channel)
            //   console.log("channel",channel);
            //   console.log("channelURL",channelURL);

            // } catch (e) { // catches a malformed URI
            //   console.error(e);

            // }
            // try {
            //     console.log(decodeURI(data['channel_data']));
            //     let urldecode = decodeURI(data['channel_data']);
            //     let channelList  = JSON.stringify(urldecode);
            //     let channelarray  = JSON.parse(channelList);
            //     console.log("channel",channelList);
            //     console.log("channelarray",channelarray);
                
          
            //   } catch (e) { // catches a malformed URI
            //     console.error(e);
          
            //   }
            

            // if (!data['access-token']) {
            //     // this._router.navigateByUrl('/signup');
            //     this._router.navigateByUrl('/email-verification');


            // }
           
          if (data['access-token']) {
                localStorage.setItem('accessToken', data['access-token']);
                // localStorage.setItem('socialUser', data['socialUser']);
         
            }else{
                
                this._router.navigateByUrl('/email-verification');

            }
          

            if (data['reg-status'] == 0) {
                if(data['inf'] == 1) {
                       let user = {
                        userType: "influencer",
                        channel: data['channel_data'],
                      
                    }
//                    let user = {
//                        userType: "influencer",
//                        channel: data['channel'],
//                        name : data['name'],
//                        lang : data['lang'],
//                        price : data['price']
//                    }
                   
                    localStorage.setItem('email',data['email']);
                localStorage.setItem('allChannels', data['channel_data']);
                // localStorage.setItem('userDetails',data.payload);
                // localStorage.setItem('userDetails', JSON.stringify(data.payload));

                }
                this._router.navigateByUrl('/signup');

            }
            
            if (data['reg-status'] == 1) {
                console.log("user is not first time user")
                this._settingsService.getProfile().subscribe(data => {
                    localStorage.setItem('userDetails', JSON.stringify(data.payload));
                    localStorage.setItem('socialUser', JSON.stringify(data.payload));
            console.log("userDetails",JSON.stringify(data.payload));
            // console.log("socialUser",JSON.stringify(data.payload));

                    this._router.navigateByUrl('/dashboard');
                    window.location.reload();
                });
            }
        })
    }
}
function urldecode(arg0: any) {
    throw new Error('Function not implemented.');
}

function json_decode($ChannelData: any): any {
    throw new Error('Function not implemented.');
}

