import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../services/http.service';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  private readonly API_ENDPOINTS = {
    HOME_LATEST_NEWS: '/public/home/getLatestNews',
    REGIONAL_NEWS: '/news/regional',
    CATEGORY_NEWS: '/news/category',
    NEWS_DETAIL: '/news',
    SEARCH_NEWS: '/news/search',
    TAGS: '/news/tags'
  };

  constructor(private httpService: HttpService) { }

  /**
   * Get latest news with pagination
   */
  getLatestNews(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.HOME_LATEST_NEWS, { ...params });
  }

  /**
   * Get regional news with pagination
   */
  getRegionalNews(params: any, language: string): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.REGIONAL_NEWS, { ...params, language });
  }

  /**
   * Get news by category with pagination
   */
  getNewsByCategory(category: string, params: any, language: string): Observable<any> {
    return this.httpService.post(
      `${this.API_ENDPOINTS.CATEGORY_NEWS}/${category}`,
      { ...params, language }
    );
  }

  /**
   * Get single news detail by ID
   */
  getNewsById(newsId: string, language: string): Observable<any> {
    return this.httpService.post(`${this.API_ENDPOINTS.NEWS_DETAIL}/${newsId}`, { language });
  }

  /**
   * Search news by query
   */
  searchNews(params: any, language: string): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.SEARCH_NEWS, { ...params, language });
  }

  /**
   * Get all available news tags
   */
  getNewsTags(language: string): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.TAGS, { language });
  }

  /**
   * Get news by tag with pagination
   */
  getNewsByTag(tag: string, params: any, language: string): Observable<any> {
    return this.httpService.post(
      `${this.API_ENDPOINTS.NEWS_DETAIL}`,
      {
        ...params,
        tag,
        language
      }
    );
  }
}
