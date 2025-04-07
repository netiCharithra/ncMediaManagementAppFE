import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
    CompactNewsCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PublicRoutingModule,
    NgbModule,
    NgbCarouselModule
  ],
  exports: [
    PublicLayoutComponent
  ]
})
export class PublicModule { }
