import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicPagesRoutingModule } from './public-pages-routing.module';
import { PublicPagesComponent } from './public-pages.component';
import { PublicHeaderComponent } from './public-header/public-header.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ViewNewsComponent } from './view-news/view-news.component';
import { CategoryNewsComponent } from './category-news/category-news.component';
import { PublicFooterComponent } from './public-footer/public-footer.component';
import { YourStatusComponent } from './your-status/your-status.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from 'app/app.module';
import { HomePageV2Component } from './home-page-v2/home-page-v2.component';
import { TimeagoModule } from 'ngx-timeago';
import { ComponentsModule } from 'app/components/components.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { DistrictNewsComponent } from './district-news/district-news.component';


@NgModule({
  declarations: [
    PublicPagesComponent,
    PublicHeaderComponent,
    HomePageComponent,
    ViewNewsComponent,
    CategoryNewsComponent,
    PublicFooterComponent,
    YourStatusComponent,
    HomePageV2Component,
    DistrictNewsComponent
  ],
  imports: [
    CommonModule, NgbModule,
    ComponentsModule,
    TimeagoModule.forRoot(),
    PublicPagesRoutingModule,
    TranslateModule.forChild() // Use forChild() if this module is a child module

    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: createTranslateLoader,
    //     deps: [HttpClient],
    //   },
    // }),
  ],
  exports: [
    // TimeagoModule
  ]
})
export class PublicPagesModule { }
