import { Component, OnInit, HostListener, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewsService } from '../../../news.service';
import { CompactNewsCardComponent } from '../compact-news-card/compact-news-card.component';
import { NewsCardComponent } from '../news-card/news-card.component';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { PublicService } from '../../services/public.service';
import { LanguageService } from '../../../services/language.service';
import { SeoService } from '../../../services/seo.service';
import { NAV_CATEGORIES } from '../../../services/schema.service';
import { SchemaService } from '../../../services/schema.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  latestNews: any[] = [];
  regionalNews: any[] = [];
  internationalNews: any[] = [];
  categoryWiseNews: any[] = [];
  categoryCategorisedNews: any[] = [];
  categoryMetaList: any[] = [];

  // Loading states
  isLoadingLatestNews = true;
  isLoadingNewsTypes = true;
  isLoadingNewsCategories = true;

  latestHasMore = false;
  regionalHasMore = false;
  internationalHasMore = false;

  // Safe default false (desktop-first); real value set in ngOnInit on browser only
  isMobile = false;

  currentLanguage: 'te' | 'en';

  constructor(
    private publicService: PublicService,
    public languageService: LanguageService,
    private seoService: SeoService,
    private schemaService: SchemaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.currentLanguage = this.languageService.getCurrentLanguage();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 768;
    }
    this.seoService.setDefaults();
    this.schemaService.injectHomepageSchema();
    // Skip data API calls on the server — they keep the SSR Zone alive
    // (backend unreachable during dev SSR → 30s timeout).
    if (isPlatformBrowser(this.platformId)) {
      this.loadLatestNews();
      this.loadNewsTypeCategorizedNews();
      this.getNewsCategoryCategorizedNews();
      this.getMetaData();
    }
  }

  loadLatestNews(): void {
    this.isLoadingLatestNews = true;
    this.publicService.getLatestNews({})
      .subscribe({
        next: (response) => {
          this.latestNews = response || [];
        },
        error: (error) => {
          console.error('Error loading latest news:', error);
        },
        complete: () => {
          this.isLoadingLatestNews = false;
        }
      });
  }

  loadNewsTypeCategorizedNews(): void {
    this.isLoadingNewsTypes = true;
    this.publicService.getNewsTypeCategorizedNews({})
      .subscribe({
        next: (response) => {
          this.categoryWiseNews = response?.[0]?.['types'] || [];
        },
        error: (error) => {
          console.error('Error loading news by type:', error);
        },
        complete: () => {
          this.isLoadingNewsTypes = false;
        }
      });
  }

  getNewsCategoryCategorizedNews(): void {
    this.isLoadingNewsCategories = true;
    this.publicService.getNewsCategoryCategorizedNews({})
      .subscribe({
        next: (response) => {
          this.categoryCategorisedNews = response || [];
        },
        error: (error) => {
          console.error('Error loading news by category:', error);
        },
        complete: () => {
          this.isLoadingNewsCategories = false;
        }
      });
  }

  getMetaData(): void {

    this.publicService.getMetaData({ metaList: ['NEWS_CATEGORIES_REGIONAL'] })
      .subscribe(response => {
        this.categoryMetaList = response?.['NEWS_CATEGORIES_REGIONAL'] || [];
      });
  }

  getCategoryLabel(label: any): any {
    const found = this.categoryMetaList.find((item: any) => item.label === label);
    return found[this.currentLanguage] || label;
  }

  /**
   * Returns the SEO-friendly URL slug for a given backend category label.
   * e.g. 'Political' → '/politics', 'Entertainment' → '/entertainment'
   * Falls back to '/category/:label' if the category is unknown.
   */
  getCategorySlug(label: string): string {
    const cat = NAV_CATEGORIES.find(
      c => c.label.toLowerCase() === label?.toLowerCase()
    );
    return cat ? `/${cat.urlSlug}` : `/category/${label}`;
  }
}
