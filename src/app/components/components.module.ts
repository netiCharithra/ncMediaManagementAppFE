import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SimpleTableComponent } from './simple-table/simple-table.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponentComponent } from './pagination-component/pagination-component.component';
import { TitleCardComponent } from './title-card/title-card.component';
import { TimeagoModule } from 'ngx-timeago';
import { CarouselComponent } from './carousel/carousel.component';
import { NoRecordsScreenComponent } from './no-records-screen/no-records-screen.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule, MatTooltipModule, MatButtonModule, NgbModule, TimeagoModule.forRoot(),
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    SimpleTableComponent,
    PaginationComponentComponent,
    TitleCardComponent,
    CarouselComponent,
    NoRecordsScreenComponent,

  ],
  exports: [
    FooterComponent,
    NavbarComponent, TitleCardComponent, CarouselComponent, NoRecordsScreenComponent,
    SidebarComponent, SimpleTableComponent],
  providers: []
})
export class ComponentsModule { }
