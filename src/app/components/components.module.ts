import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoRecordsScreenComponent } from './no-records-screen/no-records-screen.component';
import { CustomCarouselComponent } from './custom-carousel/custom-carousel.component';



@NgModule({
  declarations: [
    NoRecordsScreenComponent,
    CustomCarouselComponent,
    
  ],
  imports: [
    CommonModule
  ],
  exports:[NoRecordsScreenComponent, CustomCarouselComponent]
})
export class ComponentsModule { }
