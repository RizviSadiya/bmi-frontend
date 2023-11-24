import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LoaderService {
    private _loading: boolean = false;
    loadingStatus = new Subject<boolean>();

    get loading():boolean {
        return this._loading;
    }
    
    set loading(value) {
        this._loading = value;
        this.loadingStatus.next(value);
    }
    
    startLoading() {
        this.loading = true;
    }
    
    stopLoading() {
        this.loading = false;
    }
}