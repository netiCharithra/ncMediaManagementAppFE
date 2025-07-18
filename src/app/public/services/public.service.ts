import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../services/http.service';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  private readonly API_ENDPOINTS = {
    HOME_LATEST_NEWS: '/public/home/getLatestNews',
    HOME_NEWS_TYPE_CATEGORIZED_NEWS: '/public/home/getNewsTypeCategorizedNews',
    HOME_NEWS_CATEGORY_CATEGORIZED_NEWS: '/public/home/getNewsCategoryCategorizedNews',
    HOME_CATEGORY_NEWS_PAGINATED_ONLY: '/public/home/getCategoryNewsPaginatedOnly',
    META_DATA: '/public/metaData',
    NEWS_INFO: '/public/newsInfo',
    CATEGORY_NEWS: '/news/category',
    NEWS_DETAIL: '/news',
    SEARCH_NEWS: '/news/search',
    TAGS: '/news/tags',
    EMPLOYEE_ACTIVE_TRACING: '/public/employeeTraceCheck',
    VISITOR_COUNT: '/public/getVisitorsCount'
  };

  constructor(private httpService: HttpService) { }

  /**
   * Get latest news with pagination
   */
  getLatestNews(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.HOME_LATEST_NEWS, { ...params });
  }
  getNewsTypeCategorizedNews(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.HOME_NEWS_TYPE_CATEGORIZED_NEWS, { ...params });
  }
  getNewsCategoryCategorizedNews(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.HOME_NEWS_CATEGORY_CATEGORIZED_NEWS, { ...params });
  }
  getCategoryNewsPaginatedOnly(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.HOME_CATEGORY_NEWS_PAGINATED_ONLY, { ...params });
  }
  getMetaData(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.META_DATA, { ...params });
  }
  getNewsInfo(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.NEWS_INFO, { ...params });
  }
  employeeTraceCheck(params: any): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.EMPLOYEE_ACTIVE_TRACING, { ...params });
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


  getVisitorCount(): Observable<any> {
    return this.httpService.post(this.API_ENDPOINTS.VISITOR_COUNT, {  });
  }
}
