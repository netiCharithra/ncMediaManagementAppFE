import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from 'app/public-pages/home-page/home-page.component';
import { ViewNewsComponent } from './view-news/view-news.component';
import { CategoryNewsComponent } from './category-news/category-news.component';
import { YourStatusComponent } from './your-status/your-status.component';
import { HomePageV2Component } from './home-page-v2/home-page-v2.component';
import { DistrictNewsComponent } from './district-news/district-news.component';
import { ViewNewsV2Component } from './view-news-v2/view-news-v2.component';
import { HelpScreenComponent } from './help-screen/help-screen.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: 'yourStatus/:id', component: YourStatusComponent },
  // { path: 'home', component: ViewNewsV2Component },
  { path: 'home', component: HomePageV2Component },
  // {
  //   path: 'view-news/:id',
  //   component: ViewNewsComponent
  // },
  {
    path: 'view-news/:lang/:id/:data',
    component: ViewNewsV2Component
  },
  {
    path: 'view-news/:lang/:id',
    component: ViewNewsV2Component
  },
  {
    path: 'category-news/:id',
    component: CategoryNewsComponent
  },
  {
    path: 'dn/:id',
    component: DistrictNewsComponent
  },
  {
    path: 'help',
    component: HelpScreenComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicPagesRoutingModule { }
