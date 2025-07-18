import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AuthGuard } from './guards/auth.guard';
import { NewsManagementComponent } from './components/news-management/news-management.component';
import { EmployeeManagementComponent } from './components/employee-management/employee-management.component';
import { EmployeeTracingComponent } from './components/employee-tracing/employee-tracing.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  {
    path: '',
    component: NavigationComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'user-info', component: UserInfoComponent },
      { path: 'news-management', component: NewsManagementComponent },
      { path: 'employee-management', component: EmployeeManagementComponent },
      { path: 'employee-tracing', component: EmployeeTracingComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
