import { Component, HostListener, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PublicService } from '../../services/public.service';
import { NewsItem } from '../../../types/news.types';
import { PaginationState } from '../../../types/pagination.types';
import { SeoService } from '../../../services/seo.service';
import { NAV_CATEGORIES } from '../../../services/schema.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  category: string = '';
  newsList: NewsItem[] = [];
  pagination: PaginationState = {
    page: 1,
    count: 12,
    endOfRecords: false,
    loading: false
  };
  // Safe SSR default; updated in ngOnInit on browser
  isMobile = false;

  constructor(
    private route: ActivatedRoute,
    private publicService: PublicService,
    private seoService: SeoService,
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
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000 && !this.pagination.loading && !this.pagination.endOfRecords) {
      this.loadMore();
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 768;
    }
    this.route.params.subscribe(params => {
      this.category = params['category'];
      // Update SEO for this category
      const catMeta = NAV_CATEGORIES.find(
        c => c.label.toLowerCase() === this.category.toLowerCase()
      );
      if (catMeta) {
        this.seoService.setForCategory(catMeta.label, catMeta.te);
      } else {
        this.seoService.updateSeo({
          title: `${this.category} వార్తలు`,
          description: `Latest ${this.category} news in Telugu | Neti Charithra`,
        });
      }
      this.resetPagination();
      this.loadNews();
    });
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
        console.log('Category News Response:', response);
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
