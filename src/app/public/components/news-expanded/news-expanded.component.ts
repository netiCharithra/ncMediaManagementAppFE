import { Component, OnInit, OnDestroy, HostListener, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { NewsService } from '../../../news.service';
import { LanguageService } from '../../../services/language.service';
import { PublicService } from '../../services/public.service';
import { formatDate } from '@angular/common';
import { SeoService } from '../../../services/seo.service';
import { SchemaService } from '../../../services/schema.service';
import { NAV_CATEGORIES } from '../../../services/schema.service';

@Component({
  selector: 'app-news-expanded',
  templateUrl: './news-expanded.component.html',
  styleUrls: ['./news-expanded.component.scss'],
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ]),
      transition('* => left', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => right', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class NewsExpandedComponent implements OnInit, OnDestroy {
  news: any;
  latestNews: any[] = [];
  loading = true;
  error: string | null = null;
  newsId: string | null = null;
  language: string | null = null;

  // Skeleton loader states
  isLoadingContent = true;
  isLoadingRelatedNews = true;
  socialLinks = {
    facebook: 'https://facebook.com/neticharithra',
    twitter: 'https://twitter.com/neticharithra',
    instagram: 'https://instagram.com/neticharithra',
    youtube: 'https://youtube.com/neticharithra'
  };
  selectedImageIndex: number | null = null;
  isImageZoomed = false;
  slideDirection: 'left' | 'right' | null = null;

  // Drag functionality
  isDragging = false;
  dragStartX = 0;
  currentDragX = 0;
  dragTransform = '';
  dragThreshold = 100; // minimum drag distance to trigger navigation

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private newsService: NewsService,
    public languageService: LanguageService,
    private publicService: PublicService,
    private seoService: SeoService,
    private schemaService: SchemaService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    // Initial fetch
    this.newsId = this.route.snapshot.paramMap.get('id');
    this.language = this.route.snapshot.paramMap.get('language');

    if (this.newsId && this.language) {
      this.fetchNews(this.newsId, this.language);
    }

    // Subscribe to route parameter changes
    this.route.paramMap.subscribe(params => {
      this.newsId = params.get('id');
      this.language = params.get('language');

      if (this.newsId && this.language) {
        this.fetchNews(this.newsId, this.language);
      }
    });
  }
  isAndroid(): boolean {
    return /Android/i.test(navigator.userAgent);
  }


  private fetchNews(id: string, language: string): void {
    this.loading = true;
    this.isLoadingContent = true;
    this.error = null;

    const params = { newsId: id, language };

    this.publicService.getNewsInfo(params).subscribe({
      next: (response: any) => {
        if (response && response.specificRecord) {
          this.news = response.specificRecord[0];
          this.latestNews = response.recentRecords || [];

          // ── SEO: update meta tags for this article ──────────────────────
          const n = this.news;
          const firstImage = n.images?.[0] || n.thumbnail || undefined;
          const publishedIso = n.publishedAt
            ? new Date(n.publishedAt).toISOString()
            : n.createdAt
              ? new Date(n.createdAt).toISOString()
              : undefined;
          const shortDesc = n.summary || n.description
            ? (n.summary || n.description).substring(0, 160)
            : `${n.title} – Read the full story on Neti Charithra`;

          this.seoService.setForArticle(n.title, shortDesc, firstImage, publishedIso);

          // ── Resolve category from the article's category field ────────────
          const rawCategory: string = n.category || n.newsCategory || '';
          const catMeta = NAV_CATEGORIES.find(
            c => c.label.toLowerCase() === rawCategory.toLowerCase()
          );

          // Safe canonical URL (SSR: document.URL works on both server + browser)
          const articleCanonicalUrl =
            `https://neticharithra.com/news/${this.language}/${this.newsId}`;

          this.schemaService.injectArticleSchema({
            headline: n.title,
            description: shortDesc,
            image: firstImage,
            datePublished: publishedIso,
            dateModified: publishedIso,
            authorName: n.reportedBy?.name || n.author?.name || undefined,
            url: articleCanonicalUrl,
            categoryLabel: catMeta?.label || rawCategory || 'General',
            categorySlug: catMeta?.urlSlug || undefined,
            articleSection: catMeta?.label || rawCategory || 'General',
          });
          // ────────────────────────────────────────────────────────────────
        } else {
          this.error = 'News not found';
        }
        this.loading = false;
        setTimeout(() => { this.isLoadingContent = false; }, 500);
      },
      error: (err: any) => {
        console.error('Error fetching news:', err);
        this.error = 'Failed to load news. Please try again later.';
        this.loading = false;
        this.isLoadingContent = false;
      }
    });
  }

  // Retry loading the news
  retryLoading(): void {
    const newsId = this.route.snapshot.paramMap.get('id');
    const language = this.route.snapshot.paramMap.get('language');

    if (newsId && language) {
      this.fetchNews(newsId, language);
    }
  }

  ngOnDestroy(): void {
    // Remove article-specific schema when leaving the article page
    // to prevent it leaking onto the next page during client-side navigation.
    this.schemaService.removePageSchema('ld-json-article');
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  openSocialLink(platform: string): void {
    window.open(this.socialLinks[platform as keyof typeof this.socialLinks], '_blank');
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  openImageModal(index: number): void {
    this.selectedImageIndex = index;
    this.isImageZoomed = false;
    this.slideDirection = null;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeImageModal(): void {
    this.selectedImageIndex = null;
    this.isImageZoomed = false;
    this.slideDirection = null;
    document.body.style.overflow = ''; // Restore scrolling
  }

  navigateImage(direction: number): void {
    if (this.selectedImageIndex === null || !this.news) return;

    const newIndex = this.selectedImageIndex + direction;
    if (newIndex >= 0 && newIndex < this.news.images.length) {
      this.slideDirection = direction > 0 ? 'left' : 'right';
      this.selectedImageIndex = newIndex;
      this.isImageZoomed = false;
    }
  }

  toggleZoom(): void {
    this.isImageZoomed = !this.isImageZoomed;
  }

  startDrag(event: MouseEvent | TouchEvent): void {
    if (this.isImageZoomed) return;

    this.isDragging = true;
    this.dragStartX = this.getEventX(event);
    this.currentDragX = 0;
    this.slideDirection = null;
  }

  onDrag(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging || this.isImageZoomed) return;
    event.preventDefault();

    const currentX = this.getEventX(event);
    this.currentDragX = currentX - this.dragStartX;

    // Calculate drag percentage relative to screen width
    const dragPercentage = (this.currentDragX / window.innerWidth) * 100;
    this.dragTransform = `translateX(${dragPercentage}%)`;
  }

  endDrag(): void {
    if (!this.isDragging || this.isImageZoomed) return;

    const dragDistance = Math.abs(this.currentDragX);
    const direction = this.currentDragX > 0 ? -1 : 1;

    this.isDragging = false;
    this.dragTransform = '';

    // If dragged far enough, navigate to next/previous image
    if (dragDistance > this.dragThreshold) {
      this.navigateImage(direction);
    }
  }

  handleImageClick(event: MouseEvent): void {
    // Only toggle zoom if we haven't been dragging
    if (!this.isDragging || Math.abs(this.currentDragX) < 5) {
      this.toggleZoom();
    }
    event.stopPropagation();
  }

  private getEventX(event: MouseEvent | TouchEvent): number {
    if (event instanceof MouseEvent) {
      return event.clientX;
    } else {
      return event.touches[0].clientX;
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.selectedImageIndex === null) return;

    switch (event.key) {
      case 'Escape':
        if (this.isImageZoomed) {
          this.isImageZoomed = false;
        } else {
          this.closeImageModal();
        }
        break;
      case 'ArrowLeft':
        if (!this.isImageZoomed) {
          this.navigateImage(-1);
        }
        break;
      case 'ArrowRight':
        if (!this.isImageZoomed) {
          this.navigateImage(1);
        }
        break;
    }
  }

  shareNews(): void {
    if (navigator.share) {
      navigator.share({
        title: this.news.title,
        url: window.location.href
      })
        .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback: Copy URL to clipboard
      const dummy = document.createElement('input');
      document.body.appendChild(dummy);
      dummy.value = window.location.href;
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
      alert('URL copied to clipboard!');
    }
  }
}
