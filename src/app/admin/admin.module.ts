import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { LoginComponent } from './components/login/login.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { PaginatedTableComponent } from './reusable-components/paginated-table/paginated-table.component';

@NgModule({
  declarations: [
    LoginComponent,
    NavigationComponent,
    DashboardComponent,
    UserInfoComponent,
    PaginatedTableComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    MatSnackBarModule
  ]
})
export class AdminModule { }
