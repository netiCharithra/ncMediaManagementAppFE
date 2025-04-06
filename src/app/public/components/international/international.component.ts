import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../../news.service';
import { News } from '../../../interfaces/news.interface';

@Component({
  selector: 'app-international',
  templateUrl: './international.component.html',
  styleUrls: ['./international.component.scss']
})
export class InternationalComponent implements OnInit {
  news: News[] = [];
  hasMore = false;
  private page = 0;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.newsService.getInternationalNews(this.page).subscribe(result => {
      this.news = this.page === 0 ? result.news : [...this.news, ...result.news];
      this.hasMore = result.hasMore;
    });
  }

  loadMore(): void {
    this.page++;
    this.loadNews();
  }
}
