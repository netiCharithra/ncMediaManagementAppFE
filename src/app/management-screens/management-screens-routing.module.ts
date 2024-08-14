import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementDashboardComponent } from './management-dashboard/management-dashboard.component';
import { ManagementNewsManagementComponent } from './management-news-management/management-news-management.component';
import { ManagementEmployeeManagementComponent } from './management-employee-management/management-employee-management.component';
import { ManagementEmployeeTracingComponent } from './management-employee-tracing/management-employee-tracing.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  
  {
    path:'dashboard',
    component:ManagementDashboardComponent
  },
  {
    path:'news-management',
    component:ManagementNewsManagementComponent
  },
  {
    path:'employee-management',
    component:ManagementEmployeeManagementComponent
  },
  {
    path:'employee-tracing',
    component:ManagementEmployeeTracingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementScreensRoutingModule { }
