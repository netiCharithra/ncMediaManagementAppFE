import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-news-expanded',
  templateUrl: './news-expanded.component.html',
  styleUrls: ['./news-expanded.component.scss']
})
export class NewsExpandedComponent implements OnInit {
  news!: any;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const newsId = this.route.snapshot.paramMap.get('id');
    const language = this.route.snapshot.paramMap.get('language');
    
    if (newsId && language) {
      // Here you would typically call your news service to fetch the full news
      this.fetchNews(newsId, language);
    }
  }

  private fetchNews(id: string, language: string): void {
    // TODO: Replace with actual API call
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.news = {
        id,
        title: 'Sample News Title',
        shortDescription: 'Short description of the news',
        fullContent: 'Full content of the news article...',
        imageUrl: 'assets/images/sample-news.jpg',
        publishDate: new Date(),
        author: 'John Doe',
        category: 'regional',
        language: language as 'te' | 'en',
        tags: ['sample', 'news'],
        views: 100,
        likes: 50
      };
      this.loading = false;
    }, 1000);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
