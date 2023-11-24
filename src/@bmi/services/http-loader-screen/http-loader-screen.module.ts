import { NgModule } from '@angular/core';
import { HttpLoaderScreenService } from '@bmi/services/http-loader-screen/http-loader-screen.service';

@NgModule({
    providers: [
        HttpLoaderScreenService
    ]
})
export class HttpLoaderScreenModule
{
    /**
     * Constructor
     */
    constructor(private _httpLoaderScreenService: HttpLoaderScreenService)
    {
    }
}
