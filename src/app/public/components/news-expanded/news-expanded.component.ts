import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NewsService } from '../../../news.service';
import { LanguageService } from '../../../services/language.service';
import { PublicService } from '../../services/public.service';

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
export class NewsExpandedComponent implements OnInit {
  news: any;
  latestNews: any[] = [];
  loading = true;
  error: string | null = null;
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
    private publicService: PublicService
  ) {}

  ngOnInit(): void {
    const newsId = this.route.snapshot.paramMap.get('id');
    const language = this.route.snapshot.paramMap.get('language');
    
    if (newsId && language) {
      this.fetchNews(newsId, language);
    }
  }

  private fetchNews(id: string, language: string): void {
    this.loading = true;
    
    const params = {
      newsId: id,
      language: language
    };

    this.publicService.getNewsInfo(params).subscribe({
      next: (response) => {
        console.log("LJHLI")
        if (response && response?.specificRecord) {
          this.news = response?.specificRecord?.[0];
          this.latestNews = response?.recentRecords || [];
        } else {
          this.error = 'News not found';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching news:', error);
        this.error = 'Error loading news';
        this.loading = false;
      }
    });
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

    switch(event.key) {
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
        text: this.news.description,
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
