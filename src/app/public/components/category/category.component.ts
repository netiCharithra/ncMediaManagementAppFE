import { Component, HostListener, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PublicService } from '../../services/public.service';
import { NewsItem } from '../../../types/news.types';
import { PaginationState } from '../../../types/pagination.types';
import { SeoService } from '../../../services/seo.service';
import { NAV_CATEGORIES } from '../../../services/schema.service';
import { SchemaService } from '../../../services/schema.service';

/**
 * CategoryComponent — v2
 *
 * Supports both routing patterns:
 *  1. New SEO routes:  /general, /politics, etc.
 *     → category name comes from route.snapshot.data['category']
 *  2. Legacy pattern:  /category/:category  (should never be reached after
 *     Firebase 301s + Angular redirectTo, but kept as a safety net)
 *     → category name comes from route.snapshot.params['category']
 *
 * The component subscribes to BOTH data and params so it correctly reacts
 * when the user navigates between /general and /politics without a full reload.
 */
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  /** Display-ready category name (backend value, e.g. "Political") */
  category: string = '';
  newsList: NewsItem[] = [];
  pagination: PaginationState = {
    page: 1,
    count: 12,
    endOfRecords: false,
    loading: false
  };
  isMobile = false;

  constructor(
    private route: ActivatedRoute,
    private publicService: PublicService,
    private seoService: SeoService,
    private schemaService: SchemaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 768;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (
      (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000 &&
      !this.pagination.loading &&
      !this.pagination.endOfRecords
    ) {
      this.loadMore();
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 768;
    }

    // Subscribe to both data (new SEO routes) and params (legacy /category/:name)
    // combineLatest isn't necessary; Angular emits both on the same route change.
    this.route.data.subscribe(data => {
      const fromData: string | undefined = data['category'];
      const fromParam: string | undefined = this.route.snapshot.params['category'];
      const resolved = fromData || fromParam || '';
      if (resolved) {
        this.initCategory(resolved);
      }
    });

    // Also subscribe to params so legacy /category/:category transitions work
    this.route.params.subscribe(params => {
      if (params['category']) {
        this.initCategory(params['category']);
      }
    });
  }

  private initCategory(rawCategory: string): void {
    this.category = rawCategory;

    const catMeta = NAV_CATEGORIES.find(
      c => c.label.toLowerCase() === rawCategory.toLowerCase()
    );

    if (catMeta) {
      this.seoService.setForCategory(catMeta.label, catMeta.te, catMeta.urlSlug);
      this.schemaService.injectCategorySchema(catMeta.label, catMeta.te, catMeta.urlSlug);
    } else {
      this.seoService.updateSeo({
        title: `${rawCategory} వార్తలు`,
        description: `Latest ${rawCategory} news in Telugu | Neti Charithra`,
      });
    }

    this.resetPagination();
    this.loadNews();
  }

  resetPagination() {
    this.pagination = {
      page: 1,
      count: 6,
      endOfRecords: false,
      loading: false
    };
    this.newsList = [];
  }

  loadNews() {
    if (this.pagination.loading || this.pagination.endOfRecords) return;

    this.pagination.loading = true;
    this.publicService.getCategoryNewsPaginatedOnly({
      category: this.category,
      page: this.pagination.page,
      count: this.pagination.count
    }).subscribe({
      next: (response: any) => {
        this.newsList = [...this.newsList, ...response?.records || []];
        this.pagination.endOfRecords = response?.records?.length < this.pagination.count;
        this.pagination.page++;
        this.pagination.loading = false;
      },
      error: () => {
        this.pagination.loading = false;
        this.pagination.endOfRecords = true;
      }
    });
  }

  loadMore() {
    this.loadNews();
  }
}
