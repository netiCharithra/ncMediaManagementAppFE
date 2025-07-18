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

  constructor(
    private router: Router,
    private languageService: LanguageService
  ) {}

  navigateToFullNews(): void {
    this.router.navigate(['/news', this.languageService.getCurrentLanguage(), this.news.newsId]);
  }
}
