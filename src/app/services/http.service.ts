import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl = environment.BE_BASE_URL;
  private selectedLanguage = 'te'; // default language

  constructor(
    private http: HttpClient,
    private languageService: LanguageService
  ) {
    // Subscribe to language changes
    this.languageService.currentLang$.subscribe(lang => {
      this.selectedLanguage = lang;
    });
  }

  setLanguage(lang: string) {
    this.selectedLanguage = lang;
  }

  /**
   * Generic GET request method
   * @param endpoint - API endpoint
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
    }

    // Add language to all GET requests
    if (!params) {
      params = {};
    }
    params.language = this.selectedLanguage;

    options.params = new HttpParams({ fromObject: params });

    return this.http.get(`${this.baseUrl}${endpoint}`, options).pipe(
      map(response => response)
    );
  }

  /**
   * Generic POST request method
   * @param endpoint - API endpoint
   * @param body - Request body
   * @param headers - Optional custom headers
   * @returns Observable of type any
   */
  post(endpoint: string, body: any = {}, headers?: HttpHeaders): Observable<any> {
    const options: any = {};
    
    if (headers) {
      options.headers = headers;
    }

    // Add language to all POST requests
    const bodyWithLanguage = {
      ...body,
      language: this.selectedLanguage
    };

    return this.http.post(`${this.baseUrl}${endpoint}`, bodyWithLanguage, options).pipe(
      map(response => response)
    );
  }

  /**
   * Generic PUT request method
   * @param endpoint - API endpoint
   * @param body - Request body
   * @param headers - Optional custom headers
   * @returns Observable of type any
   */
  put(endpoint: string, body: any = {}, headers?: HttpHeaders): Observable<any> {
    const options: any = {};
    
    if (headers) {
      options.headers = headers;
    }

    // Add language to all PUT requests
    const bodyWithLanguage = {
      ...body,
      language: this.selectedLanguage
    };

    return this.http.put(`${this.baseUrl}${endpoint}`, bodyWithLanguage, options).pipe(
      map(response => response)
    );
  }

  /**
   * Generic DELETE request method
   * @param endpoint - API endpoint
   * @param headers - Optional custom headers
   * @returns Observable of type any
   */
  delete(endpoint: string, headers?: HttpHeaders): Observable<any> {
    const options: any = {};
    
    if (headers) {
      options.headers = headers;
    }

    // Add language to all DELETE requests
    options.params = new HttpParams({ fromObject: { language: this.selectedLanguage } });

    return this.http.delete(`${this.baseUrl}${endpoint}`, options).pipe(
      map(response => response)
    );
  }
}
