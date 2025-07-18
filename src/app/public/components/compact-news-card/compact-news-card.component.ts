import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-compact-news-card',
  templateUrl: './compact-news-card.component.html',
  styleUrls: ['./compact-news-card.component.scss']
})
export class CompactNewsCardComponent {
  @Input() news: any;

  constructor(
    private router: Router,
    private languageService: LanguageService
  ) {}

  navigateToFullNews() {
    this.router.navigate(['/news', this.languageService.getCurrentLanguage(), this.news.newsId]);
  }
}
