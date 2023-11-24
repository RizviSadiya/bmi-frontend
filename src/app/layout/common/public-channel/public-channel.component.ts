import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { Channel } from 'app/layout/common/channel/all-channels.types';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
    selector: 'public-channel',
    templateUrl: './public-channel.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PublicChannelComponent {
    @Input() channel: Channel;

    constructor(private toaster:ToastrService, private router:Router) {     
    }

    ngOnInit(){

    }

    pleasesignUP(){
this.toaster.error("please signUp")
this.router.navigate(['/sign-up'])
    }
}