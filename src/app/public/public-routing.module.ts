import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { HomeComponent } from './components/home/home.component';
import { RegionalComponent } from './components/regional/regional.component';
import { InternationalComponent } from './components/international/international.component';
import { LatestNewsComponent } from './components/latest-news/latest-news.component';
import { TopNewsComponent } from './components/top-news/top-news.component';
import { NewsExpandedComponent } from './components/news-expanded/news-expanded.component';

const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'regional', component: RegionalComponent },
      { path: 'international', component: InternationalComponent },
      { path: 'latest-news', component: LatestNewsComponent },
      { path: 'top-news', component: TopNewsComponent },{
        path: 'news/:language/:id',
        component: NewsExpandedComponent
      }
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
