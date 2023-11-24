import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CarouselComponent } from './carousel.component';

@NgModule({
  declarations: [
    CarouselComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    CarouselComponent
  ]

})
export class CarouselModule {
}
