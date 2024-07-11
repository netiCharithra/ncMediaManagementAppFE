import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagementScreensRoutingModule } from './management-screens-routing.module';
import { ManagementScreensComponent } from './management-screens.component';
import { ManagementDashboardComponent } from './management-dashboard/management-dashboard.component';
import { ManangementScreensNavbarComponent } from './manangement-screens-navbar/manangement-screens-navbar.component';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { ManangementScreensHeaderComponent } from './manangement-screens-header/manangement-screens-header.component';

@NgModule({
  declarations: [
    ManagementScreensComponent,
    ManagementDashboardComponent,
    ManangementScreensNavbarComponent,
    ManangementScreensHeaderComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule,
    ManagementScreensRoutingModule
  ]
})
export class ManagementScreensModule { }
