import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { Router, RouterModule, Routes } from '@angular/router';
import { PublicScreensComponent } from './public-screens/public-screens.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ManagementScreensComponent } from './management-screens/management-screens.component';
import { ManangementScreensNavbarComponent } from './management-screens/manangement-screens-navbar/manangement-screens-navbar.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
const routes: Routes = [

  {
    path: 'public',

    component: PublicScreensComponent,
    children: [{
      path: '',
      loadChildren: () => import('./public-screens/public-screens.module').then(m => m.PublicScreensModule)
    }]
  },
  {
    path: '',

    component: ManangementScreensNavbarComponent,
    children: [{
      path: '',
      loadChildren: () => import('./management-screens/management-screens.module').then(m => m.ManagementScreensModule)
    }]
  },
  { path: '**', redirectTo: '' }


];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CommonModule, BrowserModule, RouterModule.forRoot(routes, { useHash: true }), HttpClientModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  bootstrap: [AppComponent],
  providers: [
    provideAnimationsAsync()
  ]
})
export class AppModule { }
