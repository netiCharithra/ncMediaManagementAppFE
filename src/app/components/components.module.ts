import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoRecordsScreenComponent } from './no-records-screen/no-records-screen.component';



@NgModule({
  declarations: [
    NoRecordsScreenComponent,
    
  ],
  imports: [
    CommonModule
  ],
  exports:[NoRecordsScreenComponent]
})
export class ComponentsModule { }
