import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../../news.service';
import { News } from '../../../interfaces/news.interface';

@Component({
  selector: 'app-regional',
  templateUrl: './regional.component.html',
  styleUrls: ['./regional.component.scss']
})
export class RegionalComponent implements OnInit {
  news: News[] = [];
  hasMore = false;
  private page = 0;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.newsService.getRegionalNews(this.page).subscribe(result => {
      this.news = this.page === 0 ? result.news : [...this.news, ...result.news];
      this.hasMore = result.hasMore;
    });
  }

  loadMore(): void {
    this.page++;
    this.loadNews();
  }
}
