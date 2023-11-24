import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { Order } from 'app/modules/admin/apps/orders/orders.types';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { OrdersService } from '../orders.service';
import { NotificationService } from 'app/core/services/notification.service';
import { AppConstant } from 'app/app.constants';
import { CKEditor5, ChangeEvent, FocusEvent, BlurEvent } from '@ckeditor/ckeditor5-angular';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'upload-video',
  templateUrl: './upload-video.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadVideoComponent implements OnInit, OnDestroy {
  editorContent: string = ''; // The content entered in the editor
  sanitizedContent: SafeHtml;


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
  uploadForm: FormGroup;
  
  headerText: string;
  orderProcess: any;
  template_script: string = '';
  textarea:String = ''
  videoUrl:String = ''
  checkboxvalue:boolean
  constructor(
    private _formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _matDialogRef: MatDialogRef<UploadVideoComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: { order: Order, headerText: string },
    private _orderService: OrdersService,
    private _notifyService: NotificationService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.orderProcess = this._data.order;
    console.log("this.orderProcess",this.orderProcess);
    console.log("this.uploadForm",this.uploadForm);
    console.log("this._data",this._data);
    if(this.orderProcess.video_script_desc !='null'){
      this.textarea=this.orderProcess.video_script_desc
console.log("textarea",this.textarea);

    }
   
    this.headerText = this._data.headerText;
    if (this.orderProcess.video_script) {
      let script_file = this.orderProcess.video_script.split('/');
      this.template_script = script_file[script_file.length - 1];
    }

    this.uploadForm = this._formBuilder.group({
      video_script_desc: [this.orderProcess.video_script_desc],
      is_text_link_provided: [''],
      video: [this.orderProcess.stage == 2 ? this.orderProcess.video_script 
        :(this.orderProcess.stage == 3 && this.orderProcess.action_taken !== 'Approved') ? this.orderProcess.video_preview 
            : this.orderProcess.stage == 4 ? this.orderProcess.live_video : [Validators.required, Validators.pattern(AppConstant.REGEX.URLL_REG)]],
    });
    if(this.orderProcess.is_text_link_provided===0){
      this.uploadForm.controls.is_text_link_provided.setValue(false)
    console.log("this.checkboxvalue",this.checkboxvalue);
    console.log("this.this.uploadForm.get('is_text_link_provided').value",this.uploadForm.get('is_text_link_provided').value);

    }

    if (this.orderProcess.stage == 2 || this.orderProcess.stage == 3 || this.orderProcess.stage == 4) {
      const videoField = this.uploadForm.get("video");
      // const videoCheckbox = this.uploadForm.get("is_text_link_provided");
      videoField.setValidators([Validators.required, Validators.pattern(AppConstant.REGEX.URL_REG)]);
      // videoField.setValidators([Validators.pattern(AppConstant.REGEX.URL_REG)]);
      // videoCheckbox.setValidators([Validators.required]);
      videoField.updateValueAndValidity();
      // videoCheckbox.updateValueAndValidity();
    }
    // if(this.orderProcess.video_script !=null){
    //   this.uploadForm.controls.video.setValue('')
      
    //       }
  }

  resetScript(){
    this.textarea=''
  }

  sanitizeContent() {
    // Define the tags you want to remove
    const tagsToRemove = ['script', 'style','span','br'];
  
    // Create a regular expression pattern to match the tags
    const regexPattern = new RegExp(`<\/?(${tagsToRemove.join('|')})[^>]*>`, 'gi');
  
    // Use the DomSanitizer to sanitize the content and remove the specified tags
    this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.editorContent.replace(regexPattern, ''));
  }

  checkboxEvent(e){
    console.log("e",e.target.value)
    this.checkboxvalue
    console.log("this.checkboxvalue",this.checkboxvalue);

    // if(e.target.value===1){
    //   this.uploadForm.controls.is_text_link_provided.setValue(e.target.value)
    // console.log("this.uploadForm.value",this.uploadForm.value)
     
      
    // }
    console.log("checkbox",this.uploadForm.value)
  }

  templatescript(){
    this.template_script=''
      this.uploadForm.controls.video.setValue('')

    console.log("uploadForm",  this.uploadForm.controls.video.value);
    console.log("template_script", this.template_script);
    
  }

  upload(): void {
    if(this.orderProcess.stage !=2){
      if (this.uploadForm.invalid) {
        this._notifyService.showWarning("Enter a valid URL", "")
        // this._notifyService.showWarning("Please select a valid file path", "warning")
        return;
      }
    }
   
    if( (this.orderProcess.stage !=1) && (this.orderProcess.stage !=2) && (this.orderProcess.stage !=3) || (this.orderProcess.stage ===3 && this.orderProcess.action_taken==='Approved') || (this.orderProcess.stage===4)){
      if(this.checkboxvalue !=true ){
        this._notifyService.showWarning("Please select the checkBox", "warning")
        return;
      }
     
    }
   
    

//     if(this.orderProcess.video_script !=null){
// this.uploadForm.controls.video.setValue('')
//     }
//     if(this.orderProcess.video_script_desc !=null && this.orderProcess.video_script_desc ===null ){
// this.uploadForm.controls.video_script_desc.setValue('')
//     }

    const payloadData = new FormData();
    payloadData.append('order_id', this._data.order.order_id);
    payloadData.append('action_taken', 'Submit');
    payloadData.append('file_name', this.uploadForm.get('video').value);
    payloadData.append('is_text_link_provided', this.uploadForm.controls.is_text_link_provided.value);
    payloadData.append('stage',
      this._data.order.action_taken === 'Approved'
        ? this._data.order.stage + 1
        : this._data.order.stage
    );
    payloadData.append('video_script_desc', this.uploadForm.get('video_script_desc').value);
    
console.log("payloadData",payloadData)
    this._orderService.orderProcess(payloadData).subscribe(data => {
      if (data.success) {
        this._notifyService.showSuccess(data.message, "");
        this._matDialogRef.close(data.payload);
    payloadData.delete('file_name');

      }
    });
  }

  onFileSelected(files: FileList) {
// this.uploadForm.controls.video_script_desc.setValue('')

    if (files.length > 0) {
      var fileType = files[0].type;
      if (fileType.toLowerCase() == 'application/pdf' || fileType.toLowerCase().includes('document')) {
        this.uploadForm.patchValue({
          video: files[0]
        });
        this.template_script = files[0].name;
      }
    }
  }

  ngOnDestroy(): void {

  }
}