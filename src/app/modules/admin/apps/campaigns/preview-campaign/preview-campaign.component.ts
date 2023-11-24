import { Component, OnInit,Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-preview-campaign',
  templateUrl: './preview-campaign.component.html',
  styleUrls: ['./preview-campaign.component.scss']
})
export class PreviewCampaignComponent implements OnInit {

        constructor(private _router:Router,
        private _activatedRoute: ActivatedRoute,
        ) { }

   @Input() editMode:any
  ngOnInit(): void {
    console.log("editMode",this.editMode);
    
  }

  backPreview() {
    // this.previewClicked = false;
    
    this._router.navigate(['/apps/campaigns/all'], { relativeTo: this._activatedRoute });
   
}
}
