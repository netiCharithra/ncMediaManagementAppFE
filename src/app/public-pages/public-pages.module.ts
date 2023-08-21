import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicPagesRoutingModule } from './public-pages-routing.module';
import { PublicPagesComponent } from './public-pages.component';
import { PublicHeaderComponent } from './public-header/public-header.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ViewNewsComponent } from './view-news/view-news.component';
import { CategoryNewsComponent } from './category-news/category-news.component';


@NgModule({
  declarations: [
    PublicPagesComponent,
    PublicHeaderComponent,
    HomePageComponent,
    ViewNewsComponent,
    CategoryNewsComponent
  ],
  imports: [
    CommonModule,
    PublicPagesRoutingModule
  ]
})
export class PublicPagesModule { }
