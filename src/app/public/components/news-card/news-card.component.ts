import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.scss']
})
export class NewsCardComponent {
  @Input() news!: any;
  @Input() variant: 'hero' | 'horizontal' | 'compact' | 'minimal' = 'compact';

  constructor(
    private router: Router,
    private languageService: LanguageService
  ) { }

  navigateToFullNews(): void {
    this.router.navigate(['/news', this.languageService.getCurrentLanguage(), this.news.newsId]);
  }

  shareNews(event: MouseEvent): void {
    event.stopPropagation();
    const lang = this.languageService.getCurrentLanguage();
    const id = this.news.newsId;

    // Determine base URL based on environment
    const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? window.location.origin
      : 'https://neticharithra.com';

    const shareUrl = `${baseUrl}/news/${lang}/${id}`;

    if (navigator.share) {
      navigator.share({
        title: this.news.title,
        url: shareUrl
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Link copied to clipboard!');
      }).catch(err => {
        console.error('Could not copy text: ', err);
      });
    }
  }
}
