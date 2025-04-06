import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-compact-news-card',
  // standalone: true,
  // imports: [CommonModule],
  templateUrl: './compact-news-card.component.html',
  styleUrls: ['./compact-news-card.component.scss']
})
export class CompactNewsCardComponent {
  @Input() news: any;

  constructor(private router: Router) {}

  navigateToFullNews() {
    this.router.navigate(['/news', this.news.id]);
  }
}
