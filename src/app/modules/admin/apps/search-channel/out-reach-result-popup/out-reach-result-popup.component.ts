import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CreditTopupComponent } from 'app/layout/common/credit-topup/credit-topup.component';
import { ListService } from '../../list/list.service';

import { NotificationService } from 'app/core/services/notification.service';
@Component({
  selector: 'app-out-reach-result-popup',
  templateUrl: './out-reach-result-popup.component.html',
  styleUrls: ['./out-reach-result-popup.component.scss']
})
export class OutReachResultPopupComponent implements OnInit {

  constructor(
    private _matDialogRef: MatDialogRef<OutReachResultPopupComponent>,
    private _listService:ListService,
    private _matDialog: MatDialog,
    private _notifyService: NotificationService,
    
    @Inject(MAT_DIALOG_DATA) private _data: { plateform_type:any,subscriber:any ,average_view:any, engagement_rate:any,language:any
      search_keyword:any
      followers:any
      inf_score:any
      price:any },


  ) { }
  is_reveal_or_not:number =2
  user_credit:number =0
  totalProfile:number =0
  required_credit:number =0
  low_balance:boolean =false
  plateform_type:any
  listname:any
  ngOnInit(): void {

console.log("data",this._data);
this._listService.getLists({plateform_type:this._data.plateform_type}).subscribe(res=>{
  if(res){
    this.outReachList = res['payload'].list
    // this.listvalue = res['payload'].list[0].id
    console.log("outReachList",this.outReachList);
    // console.log("listvalue",this.listvalue);
    
  }
  })
 
    
 this.getOutReachData()
  }

  listvalue
  list_id
  selectListFilter(event){
    console.log("listValue",event);
    this.list_id=event.value
    this.listvalue=null
console.log("listvalue",this.listvalue);

  }

  notReveal(event){
console.log("event",event);
this.getOutReachData()
if(this.low_balance===true){
  this.close()
  this._matDialog.open(CreditTopupComponent, {
    autoFocus: false
});
}
  }


  channel_ids:any=[]
  getOutReachData(){
    this.channel_ids=[]
    let payload={
      plateform_type:this._data.plateform_type,
      average_view:this._data.average_view,
      engagement_rate:this._data.engagement_rate,
      language:this._data.language,
      search_keyword:this._data.search_keyword,
      followers:this._data.followers,
      inf_score:this._data.inf_score,
      price:this._data.price,
      subscriber:this._data.subscriber,
      is_reveal_or_not:this.is_reveal_or_not,
      perPage:this.pageValue,
    }
      this._listService.getOutReachData(payload).subscribe(res=>{
        this.outReachChannelList=res.payload.channel_list
      for (let index = 0; index < res.payload.channel_list.length; index++) {
        const element = res.payload.channel_list[index];
        console.log('element',element);
        this.channel_ids.push(element.id)
        console.log('channel_ids',this.channel_ids);

      }
     
        this.required_credit=res.payload.required_credit
        this.user_credit=res.payload.user_credit
        this.totalProfile=res.payload.total
        console.log("channel_list",this.outReachChannelList);
        
      })
  }


  close(){
    this._matDialogRef.close();
 
  }

  selectedTabIndex: number = 0;
  pageValue:any=50
  applyFilter(event){
    console.log("event",event);
    
    if(event.index===0){
      this.pageValue=50
      this.getOutReachData()
    }
    if(event.index===1){
    this.pageValue=500
    this.getOutReachData()
    }
    if(event.index===2){
    this.pageValue=1500
    this.getOutReachData()
    }
  
  }
 

  outReachList:any
  outReachChannelList:any
  plateform(event){
console.log("event",event);
this._listService.getLists({plateform_type:event}).subscribe(res=>{
if(res){
  this.outReachList = res['payload'].list
  console.log("outReachList",this.outReachList);
  
}
})


  }

  newlistname(event){
this.listvalue=event.target.value
if(this.listvalue !=null){
 
  this.list_id=null
console.log("list_id",this.list_id);

}else{
  this.listvalue=null
console.log("listvalue",this.listvalue);

}
console.log("listvalue",this.listvalue);
console.log("list_id",this.list_id);

  }

  addSitesToList(){

    let payload={
      "list_id":this.list_id,
      "list_name":this.listvalue,
      "channel_ids":this.channel_ids.toString(),
      "plateform_type":this._data.plateform_type,
      "required_credit":this.required_credit,
      "list_size":this.pageValue,
      "is_reveal_or_not":this.is_reveal_or_not
    }
    console.log("payload",payload);
    this._listService.addOutReachData(payload).subscribe(res=>{
      if(res.success){
        this._notifyService.showSuccess(res.message,'')
        this.close()
      }
    })
  }

  createdlist(value){
console.log("value",value);
console.log("plateform_type",this.plateform_type);

  }

  promotionTypeSelection(event){

  }


}
