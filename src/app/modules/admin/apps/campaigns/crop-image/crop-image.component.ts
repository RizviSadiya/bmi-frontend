import { ChangeDetectionStrategy, Component, Output, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
    selector: 'app-crop-image',
    templateUrl: './crop-image.component.html',
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CropImageComponent implements OnInit, OnDestroy {

    imageChangedEvent: any = '';
    croppedImage: any = '';

    constructor(
        private _matDialogRef: MatDialogRef<CropImageComponent>,
    ) { }

    ngOnInit(): void {
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }

    imageLoaded() {
        /* show cropper */
    }

    cropperReady() {
        /* cropper ready */
    }

    loadImageFailed() {
        /* show message */
    }

    selectImage() {
        if (this.croppedImage) {
            this._matDialogRef.close(this.croppedImage);
        }
    }

    ngOnDestroy(): void {

    }
}