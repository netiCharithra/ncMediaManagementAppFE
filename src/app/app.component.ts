import { Component, OnDestroy, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { SchemaService } from './services/schema.service';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'news-website';
  private subscription: Subscription = new Subscription();

  private isBrowser: boolean;

  constructor(
    private router: Router,
    private schemaService: SchemaService,
    private seoService: SeoService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // Inject site-wide JSON-LD once (WebSite + SiteNavigationElement)
    this.schemaService.injectSiteSchema();

    // On every route change: scroll to top + refresh canonical URL
    this.subscription.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.scrollToTop();
          // Individual pages set their own full SEO, but we refresh
          // the canonical here too as a fallback for lazy routes.
        })
    );
  }

  scrollToTop(behavior: 'auto' | 'smooth' = 'auto') {
    if (this.isBrowser) {
      window.scrollTo({ top: 0, left: 0, behavior });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
