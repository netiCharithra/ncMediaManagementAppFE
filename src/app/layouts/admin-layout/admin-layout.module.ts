import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts/lib/echarts';
import { SubscribersComponent } from 'app/subscribers/subscribers.component';
import { ComponentsModule } from 'app/components/components.module';
import { EmployeesComponent } from 'app/layouts/admin-layout/employees/employees.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NewsPublicationComponent } from 'app/layouts/admin-layout/news-publication/news-publication.component';
import { EmployeesListComponent } from 'app/layouts/admin-layout/employees-list/employees-list.component';
import { AndhraJyothiComponent } from './link-news/andhra-jyothi/andhra-jyothi.component';
import { EmployeeTracingManagementComponent } from './employee-tracing-management/employee-tracing-management.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule, ComponentsModule, QRCodeModule, ClipboardModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    NgSelectModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    SubscribersComponent,
    EmployeesComponent, NewsPublicationComponent, EmployeesListComponent, AndhraJyothiComponent, EmployeeTracingManagementComponent
  ]
})

export class AdminLayoutModule {}
