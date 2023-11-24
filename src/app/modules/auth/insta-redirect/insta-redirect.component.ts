import { Component, ViewEncapsulation, OnInit,Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { bmiAnimations } from '@bmi/animations';
import { Location } from '@angular/common';

import { SettingsService } from 'app/modules/admin/pages/settings/settings.service';
import { AuthService } from 'app/core/auth/auth.service';
import { NotificationService } from 'app/core/services/notification.service';
export type CallbackFunction = (data: any) => void;
@Component({
  selector: 'app-insta-redirect',
  templateUrl: './insta-redirect.component.html',
  encapsulation: ViewEncapsulation.None,
    animations: bmiAnimations
})

export class InstaRedirectComponent implements OnInit {
  socialProvider: string = null;
  @Input() callback: CallbackFunction;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private location: Location,
    private notyfy:NotificationService,
private _authService:AuthService,
    private _settingsService: SettingsService) {
}

  ngOnInit(): void {

    let url = this.location.path()
    console.log("url",url);
    let urlCode
    this._activatedRoute.queryParams.subscribe(data => {
      console.log("sadiya",data);
    
      urlCode=data
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
  })
  let payload={
    "code": urlCode.code
  }
  console.log("urlCode",payload);
  
  this._authService.instaCodeRedirect(payload).subscribe(res=>{
    console.log("res",res);
  this.notyfy.showSuccess(res['message'],'')

  })
  console.log("sadiya");
  this._router.navigate(['/pages/add-channel'])
  // this.notyfy.showSuccess(res.mes,'')
  }

  handleClick() {
    if (this.callback) {
      // Invoke the callback function with data
      this.callback('Hello from ExampleComponent');
    }
  }
}

