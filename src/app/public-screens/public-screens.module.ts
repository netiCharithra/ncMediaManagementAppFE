import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicScreensRoutingModule } from './public-screens-routing.module';
import { PublicScreensComponent } from './public-screens.component';
import { PublicHeaderComponent } from './public-header/public-header.component';
import { PublicHomeComponent } from './public-home/public-home.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { PublicDistrictNewsComponent } from './public-district-news/public-district-news.component';
import { ComponentsModule } from '../components/components.module';
import { PublicNewsViewComponent } from './public-news-view/public-news-view.component';
import { PublicCategorisedNewsComponent } from './public-categorised-news/public-categorised-news.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    PublicScreensComponent,
    PublicHeaderComponent,
    PublicHomeComponent,
    PublicDistrictNewsComponent,
    PublicNewsViewComponent,
    PublicCategorisedNewsComponent
  ],
  imports: [
    CommonModule,ComponentsModule,
    PublicScreensRoutingModule,RouterModule,
    TranslateModule.forChild()
  ]
})
export class PublicScreensModule { }
