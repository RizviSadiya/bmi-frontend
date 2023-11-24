import { NgModule } from '@angular/core';
import { BmiFindByKeyPipe } from '@bmi/pipes/find-by-key/find-by-key.pipe';

@NgModule({
    declarations: [
        BmiFindByKeyPipe
    ],
    exports     : [
        BmiFindByKeyPipe
    ]
})
export class BmiFindByKeyPipeModule
{
}
