import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../services/language.service';
import { StringKey } from '../../../types/language.types';

@Component({
  selector: 'app-latest-news',
  // standalone: true,
  // imports: [CommonModule],
  templateUrl: './latest-news.component.html',
  styleUrls: ['./latest-news.component.scss']
})
export class LatestNewsComponent implements OnInit {
  latestNews = [
    {
      id: 1,
      title: 'Sample News 1',
      description: 'This is a description for sample news 1',
      imageUrl: 'assets/images/news1.jpg',
      date: '2025-04-03',
      category: 'regional' as StringKey
    },
    {
      id: 2,
      title: 'Sample News 2',
      description: 'This is a description for sample news 2',
      imageUrl: 'assets/images/news2.jpg',
      date: '2025-04-03',
      category: 'international' as StringKey
    },
    {
      id: 3,
      title: 'Sample News 3',
      description: 'This is a description for sample news 3',
      imageUrl: 'assets/images/news3.jpg',
      date: '2025-04-03',
      category: 'regional' as StringKey
    },
    {
      id: 4,
      title: 'Sample News 4',
      description: 'This is a description for sample news 4',
      imageUrl: 'assets/images/news4.jpg',
      date: '2025-04-03',
      category: 'international' as StringKey
    },
    {
      id: 5,
      title: 'Sample News 5',
      description: 'This is a description for sample news 5',
      imageUrl: 'assets/images/news5.jpg',
      date: '2025-04-03',
      category: 'regional' as StringKey
    },
    {
      id: 6,
      title: 'Sample News 6',
      description: 'This is a description for sample news 6',
      imageUrl: 'assets/images/news6.jpg',
      date: '2025-04-03',
      category: 'international' as StringKey
    },
    {
      id: 7,
      title: 'Sample News 7',
      description: 'This is a description for sample news 7',
      imageUrl: 'assets/images/news7.jpg',
      date: '2025-04-03',
      category: 'regional' as StringKey
    },
    {
      id: 8,
      title: 'Sample News 8',
      description: 'This is a description for sample news 8',
      imageUrl: 'assets/images/news8.jpg',
      date: '2025-04-03',
      category: 'international' as StringKey
    }
  ];

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    // Here you would typically fetch the latest news from your backend
  }

  getString(key: StringKey): string {
    return this.languageService.getString(key);
  }
}
