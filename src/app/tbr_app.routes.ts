import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PublicScreensComponent } from './public-screens/public-screens.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

 const routes: Routes = [
    { path: '',
        
        component:PublicScreensComponent,
        loadChildren: () => import('./public-screens/public-screens.module').then(m => m.PublicScreensModule) 
    }

];

@NgModule({
    imports: [
      CommonModule,
      BrowserModule,
      RouterModule
    ],
    exports: [
    ],
  })
  export class AppRoutingModule { }
