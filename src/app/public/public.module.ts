import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbCarouselModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './components/home/home.component';
import { NewsCardComponent } from './components/news-card/news-card.component';
import { NewsExpandedComponent } from './components/news-expanded/news-expanded.component';
import { RegionalComponent } from './components/regional/regional.component';
import { InternationalComponent } from './components/international/international.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LatestNewsComponent } from './components/latest-news/latest-news.component';
import { CompactNewsCardComponent } from './components/compact-news-card/compact-news-card.component';
import { TypeComponent } from './components/type/type.component';
import { CategoryComponent } from './components/category/category.component';
import { EmployeeActiveTracingComponent } from './employee-active-tracing/employee-active-tracing.component';
import { SmartAppBannerComponent } from './components/smart-app-banner/smart-app-banner.component';
import { GrievanceComponent } from './components/grievance/grievance.component';
import { GrievanceTrackComponent } from './components/grievance-track/grievance-track.component';
import { GrievanceAdminComponent } from './components/grievance-admin/grievance-admin.component';
import { GrievanceReportsComponent } from './components/grievance-reports/grievance-reports.component';

@NgModule({
  declarations: [
    PublicLayoutComponent,
    HomeComponent,
    NewsCardComponent,
    NewsExpandedComponent,
    RegionalComponent,
    InternationalComponent,
    NavbarComponent,
    FooterComponent,
    LatestNewsComponent,
    CompactNewsCardComponent,
    TypeComponent,
    CategoryComponent,
    EmployeeActiveTracingComponent,
    SmartAppBannerComponent,
    GrievanceComponent,
    GrievanceTrackComponent,
    GrievanceAdminComponent,
    GrievanceReportsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PublicRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    NgbCarouselModule
  ],
  providers: [
    DatePipe
  ],
  exports: [
    PublicLayoutComponent
  ]
})
export class PublicModule { }
