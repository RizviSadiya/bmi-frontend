import { Component, OnInit ,Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-campaigns-alert-popup',
  templateUrl: './campaigns-alert-popup.component.html',
  styleUrls: ['./campaigns-alert-popup.component.scss']
})
export class CampaignsAlertPopupComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CampaignsAlertPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) { }

  ngOnInit(): void {
    console.log("data",this.data)
  }

  upgradePlan(){

  }

}
