import { Component, OnInit ,Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'app/core/user/user.service';
@Component({
  selector: 'app-view-proposal',
  templateUrl: './view-proposal.component.html',
  styleUrls: ['./view-proposal.component.scss']
})
export class ViewProposalComponent implements OnInit {
  proposalView:any
  constructor(
    private MatDialogRef:MatDialogRef<ViewProposalComponent>,
    private _userService:UserService,
     @Inject(MAT_DIALOG_DATA) private _data: { data:Response },
  ) { }

  socialmidea:any
  userCurrency:any
  ngOnInit(): void {
      console.log("data",this._data)
      this.userCurrency = this._userService.userDetails
      console.log("userCurrency",this.userCurrency);
      
        this.proposalView=this._data
        this.socialmidea=this.proposalView.social_media.split(',')
        console.log("socialmidea",this.socialmidea);
        
   
  }
  closeModel(){
   this.MatDialogRef.close(true)
  }

}
