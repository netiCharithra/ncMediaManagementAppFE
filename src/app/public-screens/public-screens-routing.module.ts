import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicHomeComponent } from './public-home/public-home.component';
import { PublicScreensComponent } from './public-screens.component';
import { PublicDistrictNewsComponent } from './public-district-news/public-district-news.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path:'home', component:PublicHomeComponent
  },  {
    path: 'dn/:id',
    component: PublicDistrictNewsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicScreensRoutingModule { }
