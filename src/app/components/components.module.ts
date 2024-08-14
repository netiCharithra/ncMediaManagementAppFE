import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoRecordsScreenComponent } from './no-records-screen/no-records-screen.component';
import { CustomCarouselComponent } from './custom-carousel/custom-carousel.component';
import { PaginatedTableComponent } from './paginated-table/paginated-table.component';
import { LoaderScreenComponent } from './loader-screen/loader-screen.component';



@NgModule({
  declarations: [
    NoRecordsScreenComponent,
    CustomCarouselComponent,
    PaginatedTableComponent,
    LoaderScreenComponent,
    
  ],
  imports: [
    CommonModule
  ],
  exports:[NoRecordsScreenComponent, CustomCarouselComponent, PaginatedTableComponent, LoaderScreenComponent]
})
export class ComponentsModule { }
