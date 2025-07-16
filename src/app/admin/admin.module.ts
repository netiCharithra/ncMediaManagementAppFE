import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminRoutingModule } from './admin-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

import { LoginComponent } from './components/login/login.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { PaginatedTableComponent } from './reusable-components/paginated-table/paginated-table.component';
import { NewsManagementComponent } from './components/news-management/news-management.component';
import { AdminLoaderComponent } from './components/loader/loader.component';
import { EmployeeManagementComponent } from './components/employee-management/employee-management.component';
import { EmployeeTracingComponent } from './components/employee-tracing/employee-tracing.component';
import { QRCodeModule } from 'angularx-qrcode';
import { DashboardMapComponent } from './components/dashboard-map/dashboard-map.component';
import { GeocodingService } from './services/geocoding.service';


@NgModule({
  declarations: [
    LoginComponent,
    NavigationComponent,
    DashboardComponent,
    UserInfoComponent,
    PaginatedTableComponent,
    NewsManagementComponent,
    AdminLoaderComponent,
    EmployeeManagementComponent,EmployeeTracingComponent, DashboardMapComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AdminRoutingModule,
    MatSnackBarModule,
    MatTabsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    NgSelectModule,
    QRCodeModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  providers: [
    DatePipe,
    GeocodingService
  ]

})
export class AdminModule { }
