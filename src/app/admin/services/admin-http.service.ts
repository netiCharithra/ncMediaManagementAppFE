import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminHttpService {
  private baseUrl = environment.BE_BASE_URL;
  private adminApiPath = '/admin'; // Admin-specific API path prefix

  constructor(private http: HttpClient) {}

  /**
   * Generic GET request method for admin endpoints
   * @param endpoint - API endpoint (without /admin prefix)
   * @param params - Optional query parameters
   * @param headers - Optional custom headers
   * @returns Observable of type any
   */
  get(endpoint: string, params?: any, headers?: HttpHeaders): Observable<any> {
    const options: any = {};
    
    if (params) {
      options.params = new HttpParams({ fromObject: params });
    }
    
    if (headers) {
      options.headers = headers;
    } else {
      // Set default headers for admin requests (e.g., for authentication)
      options.headers = this.getDefaultHeaders();
    }

    const fullEndpoint = `${this.adminApiPath}${endpoint}`;
    
    return this.http.get(`${this.baseUrl}${fullEndpoint}`, options).pipe(
      map((response: any) => {
        if (response && response.status === 'success') {
          return response.data;
        } else {
          console.error('Admin API Error:', response.message || 'Operation failed');
          return throwError(() => new Error(response.message || 'Operation failed'));
        }
      }),
      catchError(error => {
        console.error('Admin API Error:', error.message || 'Operation failed');
        return throwError(() => error);
      })
    );
  }

  /**
   * Generic POST request method for admin endpoints
   * @param endpoint - API endpoint (without /admin prefix)
   * @param body - Request body
   * @param headers - Optional custom headers
   * @returns Observable of type any
   */
  post(endpoint: string, body: any = {}, headers?: HttpHeaders): Observable<any> {
    const options: any = {};
    
    if (headers) {
      options.headers = headers;
    } else {
      // Set default headers for admin requests
      options.headers = this.getDefaultHeaders();
    }

    const fullEndpoint = `${this.adminApiPath}${endpoint}`;

    return this.http.post(`${this.baseUrl}${fullEndpoint}`, body, options).pipe(
      map((response: any) => {
        if (response && response.status === 'success') {
          return response.data;
        } else {
          console.error('Admin API Error:', response.message || 'Operation failed');
          return throwError(() => new Error(response.message || 'Operation failed'));
        }
      }),
      catchError(error => {
        console.error('Admin API Error:', error.message || 'Operation failed');
        return throwError(() => error);
      })
    );
  }

  /**
   * Generic PUT request method for admin endpoints
   * @param endpoint - API endpoint (without /admin prefix)
   * @param body - Request body
   * @param headers - Optional custom headers
   * @returns Observable of type any
   */
  put(endpoint: string, body: any = {}, headers?: HttpHeaders): Observable<any> {
    const options: any = {};
    
    if (headers) {
      options.headers = headers;
    } else {
      // Set default headers for admin requests
      options.headers = this.getDefaultHeaders();
    }

    const fullEndpoint = `${this.adminApiPath}${endpoint}`;

    return this.http.put(`${this.baseUrl}${fullEndpoint}`, body, options).pipe(
      map((response: any) => {
        if (response && response.status === 'success') {
          return response.data;
        } else {
          console.error('Admin API Error:', response.message || 'Operation failed');
          return throwError(() => new Error(response.message || 'Operation failed'));
        }
      }),
      catchError(error => {
        console.error('Admin API Error:', error.message || 'Operation failed');
        return throwError(() => error);
      })
    );
  }

  /**
   * Generic DELETE request method for admin endpoints
   * @param endpoint - API endpoint (without /admin prefix)
   * @param headers - Optional custom headers
   * @returns Observable of type any
   */
  delete(endpoint: string, headers?: HttpHeaders): Observable<any> {
    const options: any = {};
    
    if (headers) {
      options.headers = headers;
    } else {
      // Set default headers for admin requests
      options.headers = this.getDefaultHeaders();
    }

    const fullEndpoint = `${this.adminApiPath}${endpoint}`;

    return this.http.delete(`${this.baseUrl}${fullEndpoint}`, options).pipe(
      map((response: any) => {
        if (response && response.status === 'success') {
          return response.data;
        } else {
          console.error('Admin API Error:', response.message || 'Operation failed');
          return throwError(() => new Error(response.message || 'Operation failed'));
        }
      }),
      catchError(error => {
        console.error('Admin API Error:', error.message || 'Operation failed');
        return throwError(() => error);
      })
    );
  }

  /**
   * Get default headers for admin API requests
   * This can include auth tokens, content type, etc.
   */
  private getDefaultHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    
    // Get auth token from localStorage or other storage mechanism
    const authToken = localStorage.getItem('admin_auth_token');
    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    }
    
    return headers;
  }

  // Admin-specific API methods

  /**
   * Get news list for admin dashboard
   * @param params - Query parameters for filtering and pagination
   */
  getNewsList(params?: any): Observable<any> {
    return this.get('/news', params);
  }

  /**
   * Get pending news for approval
   * @param params - Query parameters for filtering and pagination
   */
  getPendingNews(params?: any): Observable<any> {
    return this.get('/news/pending', params);
  }

  /**
   * Get approved news
   * @param params - Query parameters for filtering and pagination
   */
  getApprovedNews(params?: any): Observable<any> {
    return this.get('/news/approved', params);
  }

  /**
   * Get rejected news
   * @param params - Query parameters for filtering and pagination
   */
  getRejectedNews(params?: any): Observable<any> {
    return this.get('/news/rejected', params);
  }

  /**
   * Approve a news article
   * @param newsId - ID of the news article to approve
   */
  approveNews(newsId: string): Observable<any> {
    return this.put(`/news/${newsId}/approve`, {});
  }

  /**
   * Reject a news article
   * @param newsId - ID of the news article to reject
   * @param reason - Reason for rejection
   */
  rejectNews(newsId: string, reason: string): Observable<any> {
    return this.put(`/news/${newsId}/reject`, { reason });
  }

  /**
   * Create a new news article
   * @param newsData - News article data
   */
  createNews(newsData: any): Observable<any> {
    return this.post('/news', newsData);
  }

  /**
   * Update an existing news article
   * @param newsId - ID of the news article to update
   * @param newsData - Updated news article data
   */
  updateNews(newsId: string, newsData: any): Observable<any> {
    return this.put(`/news/${newsId}`, newsData);
  }

  /**
   * Delete a news article
   * @param newsId - ID of the news article to delete
   */
  deleteNews(newsId: string): Observable<any> {
    return this.delete(`/news/${newsId}`);
  }

  /**
   * Get user management data
   * @param params - Query parameters for filtering and pagination
   */
  getUsers(params?: any): Observable<any> {
    return this.get('/users', params);
  }

  /**
   * Create a new user
   * @param userData - User data
   */
  createUser(userData: any): Observable<any> {
    return this.post('/users', userData);
  }

  /**
   * Update an existing user
   * @param userId - ID of the user to update
   * @param userData - Updated user data
   */
  updateUser(userId: string, userData: any): Observable<any> {
    return this.put(`/users/${userId}`, userData);
  }

  /**
   * Delete a user
   * @param userId - ID of the user to delete
   */
  deleteUser(userId: string): Observable<any> {
    return this.delete(`/users/${userId}`);
  }

  /**
   * Get category management data
   * @param params - Query parameters for filtering and pagination
   */
  getCategories(params?: any): Observable<any> {
    return this.get('/categories', params);
  }

  /**
   * Create a new category
   * @param categoryData - Category data
   */
  createCategory(categoryData: any): Observable<any> {
    return this.post('/categories', categoryData);
  }

  /**
   * Update an existing category
   * @param categoryId - ID of the category to update
   * @param categoryData - Updated category data
   */
  updateCategory(categoryId: string, categoryData: any): Observable<any> {
    return this.put(`/categories/${categoryId}`, categoryData);
  }

  /**
   * Delete a category
   * @param categoryId - ID of the category to delete
   */
  deleteCategory(categoryId: string): Observable<any> {
    return this.delete(`/categories/${categoryId}`);
  }
}
