import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagementScreensRoutingModule } from './management-screens-routing.module';
import { ManagementScreensComponent } from './management-screens.component';
import { ManagementDashboardComponent } from './management-dashboard/management-dashboard.component';


@NgModule({
  declarations: [
    ManagementScreensComponent,
    ManagementDashboardComponent
  ],
  imports: [
    CommonModule,
    ManagementScreensRoutingModule
  ]
})
export class ManagementScreensModule { }
