import { Injectable, Inject } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { DOCUMENT } from '@angular/common';

import { LoaderService } from "app/core/services/loader.service";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    activeRequests: number = 0;

    /**
    * URLs for which the loading screen should not be enabled
    */
    skippUrls = [
        '/login',
    ];

    constructor(
        @Inject(DOCUMENT) private _document: any,public loaderService: LoaderService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let displayLoadingScreen = true;
    
        for (const skippUrl of this.skippUrls) {
            if (new RegExp(skippUrl).test(request.url)) {
                displayLoadingScreen = false;
                break;
            }
        }
    
        if (displayLoadingScreen) {
            if (this.activeRequests === 0) {
                this.loaderService.startLoading();
                this._document.body.classList.remove('http-loader-screen-hidden');
            }
            this.activeRequests++;
    
            return next.handle(request).pipe(
                finalize(() => {
                    this.activeRequests--;
                    if (this.activeRequests === 0) {
                        this.loaderService.stopLoading();
                        this._document.body.classList.add('http-loader-screen-hidden');
                    }
                })
            )
        } else {
            return next.handle(request);
        }
    };
}