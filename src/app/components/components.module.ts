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

@NgModule({
  imports: [
    CommonModule,
    RouterModule, MatTooltipModule, MatButtonModule, NgbModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    SimpleTableComponent,
    PaginationComponentComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent, SimpleTableComponent ],
  providers: []
})
export class ComponentsModule { }
