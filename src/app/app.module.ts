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

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
const routes: Routes = [

 { path: '',
      
    component:PublicScreensComponent,
    loadChildren: () => import('./public-screens/public-screens.module').then(m => m.PublicScreensModule) 
},
{ path: '**', redirectTo: '' }


];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CommonModule,BrowserModule,RouterModule.forRoot(routes),HttpClientModule,
    
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
