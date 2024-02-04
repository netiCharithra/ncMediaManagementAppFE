import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from 'app/public-pages/home-page/home-page.component';
import { ViewNewsComponent } from './view-news/view-news.component';
import { CategoryNewsComponent } from './category-news/category-news.component';
import { YourStatusComponent } from './your-status/your-status.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: 'yourStatus/:id', component: YourStatusComponent },
  { path: 'home', component: HomePageComponent },
  {
    path: 'view-news/:id',
    component: ViewNewsComponent
  },
  {
    path: 'category-news/:id',
    component: CategoryNewsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicPagesRoutingModule { }
