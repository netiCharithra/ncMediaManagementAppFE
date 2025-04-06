export interface News {
  id: string;
  title: string;
  shortDescription: string;
  fullContent: string;
  imageUrl: string;
  publishDate: Date;
  author: string;
  category: 'regional' | 'international' | 'latest' | 'top';
  language: 'te' | 'en';
  tags: string[];
  views: number;
  likes: number;
}
