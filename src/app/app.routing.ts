import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './login/login.component';
import { EmployeeSignupComponent } from './employee-signup/employee-signup.component';
import { PublicPagesComponent } from './public-pages/public-pages.component';

const routes: Routes = [
  {
    path: '',
    component:PublicPagesComponent,
    children: [{
      path: '',
      loadChildren: () => import('./public-pages/public-pages.module').then(m => m.PublicPagesModule)
    }]
  },
  
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: EmployeeSignupComponent
  },
  {
    path: 'app',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
    }]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
       useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
