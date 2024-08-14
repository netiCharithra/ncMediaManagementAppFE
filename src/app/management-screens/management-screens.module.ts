import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

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
import { NgxEchartsModule } from 'ngx-echarts';
import { ManagementNewsManagementComponent } from './management-news-management/management-news-management.component';
import { ManagementEmployeeManagementComponent } from './management-employee-management/management-employee-management.component';
import { ManagementEmployeeTracingComponent } from './management-employee-tracing/management-employee-tracing.component';
import {MatTabsModule} from '@angular/material/tabs';
import { ComponentsModule } from '../components/components.module';
import { PendingNewsComponent } from './management-news-management/pending-news/pending-news.component';
import { ApprovedNewsComponent } from './management-news-management/approved-news/approved-news.component';
import { RejectedNewsComponent } from './management-news-management/rejected-news/rejected-news.component';
import { FormsModule, NgForm } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  declarations: [
    ManagementScreensComponent,
    ManagementDashboardComponent,
    ManangementScreensNavbarComponent,
    ManangementScreensHeaderComponent,
    ManagementNewsManagementComponent,
    ManagementEmployeeManagementComponent,
    ManagementEmployeeTracingComponent,
    PendingNewsComponent,
    ApprovedNewsComponent,
    RejectedNewsComponent
  ],
  imports: [
    CommonModule,ComponentsModule,FormsModule,NgSelectModule,MatMenuModule,
    MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule,MatTabsModule,
    ManagementScreensRoutingModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  providers:[DatePipe]
})
export class ManagementScreensModule { }
