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
import { YourStatusComponent } from './your-status/your-status.component';
import { PublicHelpScreenComponent } from './public-help-screen/public-help-screen.component';
import { ManagementLoginComponent } from './management-login/management-login.component';
import { FormsModule } from '@angular/forms';

import {ErrorStateMatcher} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
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
    PublicCategorisedNewsComponent,
    YourStatusComponent,
    PublicHelpScreenComponent
  ],
  imports: [
    CommonModule,ComponentsModule,FormsModule,
    PublicScreensRoutingModule,RouterModule,
    TranslateModule.forChild()
  ]
})
export class PublicScreensModule { }
