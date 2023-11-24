import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { Order } from 'app/modules/admin/apps/orders/orders.types';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { OrdersService } from '../orders.service';
import { NotificationService } from 'app/core/services/notification.service';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';


@Component({
  selector: 'campaign-resource-document',
  templateUrl: './campaign-resource-document.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampaignResourceDocumentComponent implements OnInit, OnDestroy {
  resourceForm: FormGroup;
  template_script: string;
  jdCommentDescription = "Campaign Resource document\n" +
    " - Any specific instructions as to how the brand should be presented in promo time slot\n" +
    " - How brand wants his 'promotion part' to look/sound like\n" +
    " - What to speak about the brand such as list of features \n" +
    " - Any “Template script“ to refer or stick to\n" +
    " - Suggestions on the video concept/script ideas";
  order_process: any;
  script_file: any;

  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      // height: '300px',
      height: '200px',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
    
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        // {class: 'kruti-dev', name: 'kruti dev'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    // uploadUrl: 'v1/image',
    // // upload: (file: File) => { ... }
    // uploadWithCredentials: false,
    // sanitize: true,
    // toolbarPosition: 'top',
    // toolbarHiddenButtons: [
    //   ['bold', 'italic'],
    //   ['fontSize']
    // ]
};
  constructor(
    private _formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _matDialogRef: MatDialogRef<CampaignResourceDocumentComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: { order: any ,type:any},
    private _orderService: OrdersService,
    private _notifyService: NotificationService,
    private route: Router,

  ) { }
type:any
job_description:any
  ngOnInit(): void {
    console.log('Abhishektest2',this._data.order);
    console.log(this._data);

    this.order_process = this._data.order;
    this.type = this._data.type;
    this.script_file = this._data.order.template_script;
    if(this._data.order.template_script !=null){
    let script_file = this._data.order.template_script.split('/');
        this.template_script = script_file[script_file.length - 1];
    }
    if(this.order_process.job_description !='null'){
      this.job_description =this.order_process.job_description
    }

    this.resourceForm = this._formBuilder.group({
      
      instruction: [this.job_description],
      template_script: [this.order_process.template_script],
      suggestions: [this.order_process.suggestions]
    });
    // if(this.order_process.template_script !=null){
    //   this.resourceForm.controls.template_script.setValue('')
    // }
  }
  

  submit(): void {
    console.log("this.resourceForm",this.resourceForm);

    if(this.resourceForm.get('instruction').value===null && this.resourceForm.get('template_script').value===null){
      this._notifyService.showError("please fill form",'')
      
      return
    }
    // if(this.order_process.job_description !=null || this.order_process.job_description===null){
    //   this.resourceForm.controls.instruction.setValue('')
    // }
    // if(this.order_process.template_script !=null){
    //   this.resourceForm.controls.template_script.setValue('')
    // }
    const payloadData = new FormData();
    payloadData.append('order_id', this._data.order.id);
    payloadData.append('action_taken', 'Submit');
    payloadData.append('file_name', this.resourceForm.get('template_script').value);
    payloadData.append('job_description', this.resourceForm.get('instruction').value);
    payloadData.append('stage', '1');
    payloadData.append('comment', this.resourceForm.get('suggestions').value);

    this._orderService.orderProcess(payloadData).subscribe(data => {
      if (data.success) {
        this._notifyService.showSuccess(data.message, "");
        // this._notifyService.showSuccess("Resource Document successfully sent to Influencer", "");
        this._matDialogRef.close(data.payload);
        this.route.navigate(['pages/orders'])

      }
    });
  }

  onFileSelected(files: FileList) {
    // if(this.order_process.job_description !=null || this.order_process.job_description===null){
    //   this.resourceForm.controls.instruction.setValue('')
    // }
    console.log("file",files);
    
    if (files) {
      var fileType = files[0].type;
      if (fileType.toLowerCase() == 'application/pdf' || fileType.toLowerCase().includes('document')) {
        this.resourceForm.patchValue({
          template_script: files[0]
        });
        this.template_script = files[0].name;
        this.script_file = files[0].name;
        console.log("files",files);
        
      }
    }
  }

  ngOnDestroy(): void {

  }
}