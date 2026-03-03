import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { HomeComponent } from './components/home/home.component';
import { RegionalComponent } from './components/regional/regional.component';
import { InternationalComponent } from './components/international/international.component';
import { LatestNewsComponent } from './components/latest-news/latest-news.component';
import { TopNewsComponent } from './components/top-news/top-news.component';
import { NewsExpandedComponent } from './components/news-expanded/news-expanded.component';
import { TypeComponent } from './components/type/type.component';
import { CategoryComponent } from './components/category/category.component';
import { EmployeeActiveTracingComponent } from './employee-active-tracing/employee-active-tracing.component';
import { GrievanceComponent } from './components/grievance/grievance.component';
import { GrievanceTrackComponent } from './components/grievance-track/grievance-track.component';
import { GrievanceAdminComponent } from './components/grievance-admin/grievance-admin.component';
import { GrievanceReportsComponent } from './components/grievance-reports/grievance-reports.component';

/**
 * SEO-Optimised Routing Architecture — v2 (2026-03-03)
 *
 * URL changes vs v1:
 *  /home                  → /          (redirected via firebase.json 301)
 *  /category/General      → /general
 *  /category/Political    → /politics
 *  /category/Entertainment→ /entertainment
 *  /category/Sports       → /sports
 *  /category/Technology   → /technology
 *  /category/Business     → /business
 *
 * Angular handles client-side navigation.
 * Firebase Hosting handles 301 redirects for crawlers & old bookmarks.
 */

const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      // ── Homepage ───────────────────────────────────────────────────────────
      { path: '', component: HomeComponent, pathMatch: 'full' },

      // ── Legacy /home redirect → root (Angular-side safety net) ─────────────
      { path: 'home', redirectTo: '', pathMatch: 'full' },

      // ── Section pages ─────────────────────────────────────────────────────
      { path: 'regional', component: RegionalComponent },
      { path: 'international', component: InternationalComponent },
      { path: 'latest-news', component: LatestNewsComponent },
      { path: 'top-news', component: TopNewsComponent },

      // ── SEO-friendly top-level category routes ────────────────────────────
      // Canonical mapping: /general, /politics, /entertainment, /sports, /technology, /business
      // CategoryComponent reads ActivatedRoute params; we pass the backend category name
      // via the route 'state' data so no param extraction change is needed in the component.
      { path: 'general', component: CategoryComponent, data: { category: 'General' } },
      { path: 'politics', component: CategoryComponent, data: { category: 'Political' } },
      { path: 'entertainment', component: CategoryComponent, data: { category: 'Entertainment' } },
      { path: 'sports', component: CategoryComponent, data: { category: 'Sports' } },
      { path: 'technology', component: CategoryComponent, data: { category: 'Technology' } },
      { path: 'business', component: CategoryComponent, data: { category: 'Business' } },

      // ── Legacy /category/:category routes (Angular-side 301 equivalents) ─
      // Firebase 301s cover crawlers; these guards protect direct Angular navigation.
      { path: 'category/General', redirectTo: '/general', pathMatch: 'full' },
      { path: 'category/general', redirectTo: '/general', pathMatch: 'full' },
      { path: 'category/Political', redirectTo: '/politics', pathMatch: 'full' },
      { path: 'category/political', redirectTo: '/politics', pathMatch: 'full' },
      { path: 'category/Entertainment', redirectTo: '/entertainment', pathMatch: 'full' },
      { path: 'category/entertainment', redirectTo: '/entertainment', pathMatch: 'full' },
      { path: 'category/Sports', redirectTo: '/sports', pathMatch: 'full' },
      { path: 'category/sports', redirectTo: '/sports', pathMatch: 'full' },
      { path: 'category/Technology', redirectTo: '/technology', pathMatch: 'full' },
      { path: 'category/technology', redirectTo: '/technology', pathMatch: 'full' },
      { path: 'category/Business', redirectTo: '/business', pathMatch: 'full' },
      { path: 'category/business', redirectTo: '/business', pathMatch: 'full' },

      // ── Article page ──────────────────────────────────────────────────────
      { path: 'news/:language/:id', component: NewsExpandedComponent },

      // ── Type pages (internal only, not in primary nav) ─────────────────────
      { path: 'type/:type', component: TypeComponent },

      // ── Employee tracing (internal) ──────────────────────────────────────
      { path: 'validate-employee/:employeeId', component: EmployeeActiveTracingComponent },
    ]
  },

  // ── Grievance portal (outside PublicLayout shell) ───────────────────────
  { path: 'grievance', component: GrievanceComponent },
  { path: 'grievance/admin', component: GrievanceAdminComponent },
  { path: 'grievance/compliance-reports', component: GrievanceReportsComponent },
  { path: 'grievance/track', component: GrievanceTrackComponent },
  { path: 'grievance/:ticketId/track', component: GrievanceTrackComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
