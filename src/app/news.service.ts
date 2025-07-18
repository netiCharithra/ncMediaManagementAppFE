import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private mockNews: any[] = [
    // Regional News
    {
      id: '1',
      title: 'Telangana Government Launches New Education Initiative',
      shortDescription: 'A groundbreaking education program aims to transform rural schools with modern technology and innovative teaching methods.',
      fullContent: 'The Telangana government has unveiled a comprehensive education program that will revolutionize learning in rural schools. The initiative includes smart classrooms, digital libraries, and teacher training programs.',
      category: 'regional',
      imageUrl: 'https://picsum.photos/400/300?random=1',
      publishDate: new Date('2025-04-03'),
      author: 'Rahul Kumar',
      language: 'te',
      tags: ['education', 'technology', 'rural development'],
      views: 1200,
      likes: 450
    },
    {
      id: '2',
      title: 'Hyderabad Metro Expands to New Routes',
      shortDescription: 'The city\'s metro network grows with three new lines connecting major IT hubs and residential areas.',
      fullContent: 'Hyderabad Metro Rail has announced the expansion of its network with three new lines. The expansion will connect major IT corridors and residential areas, reducing commute times significantly.',
      category: 'regional',
      imageUrl: 'https://picsum.photos/400/300?random=2',
      publishDate: new Date('2025-04-03'),
      author: 'Priya Sharma',
      language: 'te',
      tags: ['transport', 'infrastructure', 'urban development'],
      views: 980,
      likes: 320
    },
    {
      id: '3',
      title: 'Local Farmers Embrace Organic Farming',
      shortDescription: 'Sustainable agriculture practices gain momentum as more farmers switch to organic methods.',
      fullContent: 'Farmers across Telangana are increasingly adopting organic farming methods. This shift is supported by government initiatives and growing consumer demand for organic produce.',
      category: 'regional',
      imageUrl: 'https://picsum.photos/400/300?random=3',
      publishDate: new Date('2025-04-02'),
      author: 'Suresh Reddy',
      language: 'te',
      tags: ['agriculture', 'organic', 'sustainability'],
      views: 750,
      likes: 280
    },
    {
      id: '4',
      title: 'Cultural Festival Celebrates Telugu Heritage',
      shortDescription: 'Annual festival showcases traditional arts, music, and cuisine of Telangana and Andhra Pradesh.',
      fullContent: 'The annual cultural festival brings together artists, musicians, and food enthusiasts to celebrate the rich heritage of Telugu states. The event features classical performances and traditional crafts.',
      category: 'regional',
      imageUrl: 'https://picsum.photos/400/300?random=4',
      publishDate: new Date('2025-04-02'),
      author: 'Lakshmi Rao',
      language: 'te',
      tags: ['culture', 'arts', 'festival'],
      views: 890,
      likes: 410
    },
    {
      id: '5',
      title: 'New Tech Park Creates Job Opportunities',
      shortDescription: 'Major IT companies set up offices in the new technology park, promising thousands of jobs.',
      fullContent: 'A new technology park in Hyderabad has attracted several multinational companies. The development is expected to create over 10,000 jobs in the IT sector.',
      category: 'regional',
      imageUrl: 'https://picsum.photos/400/300?random=5',
      publishDate: new Date('2025-04-01'),
      author: 'Arun Kumar',
      language: 'te',
      tags: ['technology', 'jobs', 'development'],
      views: 1500,
      likes: 520
    },

    // International News
    {
      id: '6',
      title: 'Global Climate Summit Reaches Historic Agreement',
      shortDescription: 'World leaders commit to ambitious carbon reduction targets in landmark climate deal.',
      fullContent: 'In a historic move, world leaders have agreed to significantly reduce carbon emissions by 2030. The agreement includes substantial funding for renewable energy projects.',
      category: 'international',
      imageUrl: 'https://picsum.photos/400/300?random=6',
      publishDate: new Date('2025-04-03'),
      author: 'Sarah Johnson',
      language: 'en',
      tags: ['climate', 'environment', 'global'],
      views: 2500,
      likes: 890
    },
    {
      id: '7',
      title: 'Breakthrough in Renewable Energy Technology',
      shortDescription: 'Scientists develop more efficient solar panels that could revolutionize clean energy production.',
      fullContent: 'Researchers have developed a new type of solar panel with 40% higher efficiency. This breakthrough could make solar energy more accessible and affordable.',
      category: 'international',
      imageUrl: 'https://picsum.photos/400/300?random=7',
      publishDate: new Date('2025-04-03'),
      author: 'Michael Chen',
      language: 'en',
      tags: ['technology', 'renewable energy', 'innovation'],
      views: 1800,
      likes: 670
    },
    {
      id: '8',
      title: 'Space Mission Discovers New Exoplanets',
      shortDescription: 'Astronomical research reveals potentially habitable planets in nearby solar systems.',
      fullContent: 'Astronomers have discovered three Earth-like planets in a nearby solar system. The planets are located in the habitable zone and could potentially support life.',
      category: 'international',
      imageUrl: 'https://picsum.photos/400/300?random=8',
      publishDate: new Date('2025-04-02'),
      author: 'David Miller',
      language: 'en',
      tags: ['space', 'science', 'discovery'],
      views: 2100,
      likes: 780
    },
    {
      id: '9',
      title: 'Global Economic Forum Addresses AI Impact',
      shortDescription: 'Leaders discuss the future of work and economy in the age of artificial intelligence.',
      fullContent: 'The Global Economic Forum has concluded with key recommendations on managing AI\'s impact on employment and economic growth. Leaders emphasized the need for reskilling programs.',
      category: 'international',
      imageUrl: 'https://picsum.photos/400/300?random=9',
      publishDate: new Date('2025-04-02'),
      author: 'Emma Wilson',
      language: 'en',
      tags: ['economy', 'AI', 'future'],
      views: 1950,
      likes: 720
    },
    {
      id: '10',
      title: 'Cultural Exchange Program Launches',
      shortDescription: 'New initiative promotes international understanding through arts and education.',
      fullContent: 'A new global cultural exchange program will connect artists and students from 50 countries. The program aims to foster cross-cultural understanding and collaboration.',
      category: 'international',
      imageUrl: 'https://picsum.photos/400/300?random=10',
      publishDate: new Date('2025-04-01'),
      author: 'Maria Garcia',
      language: 'en',
      tags: ['culture', 'education', 'global'],
      views: 1600,
      likes: 590
    }
  ];

  private pageSize = 5;

  getLatestNews(page: number = 0): Observable<{ news: any[], hasMore: boolean }> {
    const pageSize=13
    const sortedNews = [...this.mockNews].sort((a, b) => 
      b.publishDate.getTime() - a.publishDate.getTime()
    );
    const start = page * pageSize;
    const news = sortedNews.slice(start, start + pageSize);
    const hasMore = start + pageSize < sortedNews.length;
    return of({ news, hasMore });
  }

  getTopNews(page: number = 0): Observable<{ news: any[], hasMore: boolean }> {
    const sortedNews = [...this.mockNews].sort((a, b) => b.views - a.views);
    const start = page * this.pageSize;
    const news = sortedNews.slice(start, start + this.pageSize);
    const hasMore = start + this.pageSize < sortedNews.length;
    return of({ news, hasMore });
  }

  getRegionalNews(page: number = 0): Observable<{ news: any[], hasMore: boolean }> {
    const filtered = this.mockNews.filter(news => news.category === 'regional');
    const start = page * this.pageSize;
    const news = filtered.slice(start, start + this.pageSize);
    const hasMore = start + this.pageSize < filtered.length;
    return of({ news, hasMore });
  }

  getInternationalNews(page: number = 0): Observable<{ news: any[], hasMore: boolean }> {
    const filtered = this.mockNews.filter(news => news.category === 'international');
    const start = page * this.pageSize;
    const news = filtered.slice(start, start + this.pageSize);
    const hasMore = start + this.pageSize < filtered.length;
    return of({ news, hasMore });
  }
}
