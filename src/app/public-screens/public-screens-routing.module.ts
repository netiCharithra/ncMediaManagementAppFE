import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicHomeComponent } from './public-home/public-home.component';
import { PublicScreensComponent } from './public-screens.component';
import { PublicDistrictNewsComponent } from './public-district-news/public-district-news.component';
import { PublicNewsViewComponent } from './public-news-view/public-news-view.component';
import { PublicCategorisedNewsComponent } from './public-categorised-news/public-categorised-news.component';

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
  {
    path: 'view-news/:lang/:id/:data',
    component: PublicNewsViewComponent
  },
  {
    path: 'view-news/:lang/:id',
    component: PublicNewsViewComponent
  },
  {
    path: 'category-news/:id',
    component: PublicCategorisedNewsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicScreensRoutingModule { }
