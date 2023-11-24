import { NgModule } from '@angular/core';
import { BmiMediaWatcherService } from '@bmi/services/media-watcher/media-watcher.service';

@NgModule({
    providers: [
        BmiMediaWatcherService
    ]
})
export class BmiMediaWatcherModule
{
    /**
     * Constructor
     */
    constructor(private _fuseMediaWatcherService: BmiMediaWatcherService)
    {
    }
}
