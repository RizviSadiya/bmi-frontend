import { Component, OnInit ,Inject,Input} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { ListService } from 'app/modules/admin/apps/list/list.service';
import { ListService } from 'app/modules/admin/apps/list/list.service';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'app-viewlist-detail',
  templateUrl: './viewlist-detail.component.html',
  styleUrls: ['./viewlist-detail.component.scss']
})
export class ViewlistDetailComponent implements OnInit {

  constructor(
    private listService:ListService,
    private userService:UserService,
    @Inject(MAT_DIALOG_DATA) private data:any
  ) { }
  userType='INFLUENCER'
  mode = 'response'
  channels:any=[]
  ngOnInit(): void {
    // this.channels = JSON.parse(localStorage.getItem('list_data'))   

  console.log("data",this.data);
  
    this.channels = this.userService.getListData()
    // this.channels = localStorage.getItem('list_data')
    console.log('channels',this.channels);

    // console.log("data",this.data);

    
    // this.channels = this.data.list.channelList

    // this.channels = JSON.parse(localStorage.getItem('list_data'))   
    // console.log('channels',this.channels);
    // console.log('list',this.list);
    
  }
  trackByFn(index: number, item: any): any {
    return item.id || index;
}
}
