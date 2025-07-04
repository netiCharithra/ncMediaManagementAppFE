import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of, switchMap, from } from 'rxjs';
import { environment } from '../../environments/environment';
import { LanguageService } from './language.service';
import { StorageService } from '../admin/services/storage.service';
import { MessageService } from '../admin/services/message.service';
import { VisitorsService } from './visitors.service';
import { LocationService } from './location.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl = environment.BE_BASE_URL;
  private selectedLanguage = 'te'; // default language

  constructor(
    private http: HttpClient,
    private languageService: LanguageService, private storage: StorageService, private messageService: MessageService, private visitorsService: VisitorsService, private locationService: LocationService
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
      map((response: any) => {
        console.log("RES", response?.data)
        if (response && response.status === 'success' && response?.data) {
          return response?.data;
        } else {
          console.error('API Error:', response.message || 'Operation failed');
          throw new Error(response.message || 'Operation failed');
        }
      }),
      catchError(error => {
        console.error('API Error:', error.message || 'Operation failed');
        throw error;
      })
    );
  }

  /**
   * Generic POST request method
   * @param endpoint - API endpoint
   * @param body - Request body
   * @param headers - Optional custom headers
   * @returns Observable of type any
   */
  post(
    endpoint: string,
    body: any = {},
    headers?: HttpHeaders,
    formData: any = null,
    loggedUserDetails?: boolean,
    returnEntireResponse?: boolean
  ): Observable<any> {
    const options: any = {};
    if (headers) {
      options.headers = headers;
    }
  
    // Get visitorId (sync) and location (async)
    const visitorId = this.visitorsService.getOrCreateVisitorId();
  
    return from(this.locationService.getLocation()).pipe(
      switchMap((location) => {
        console.log("location", location)
        let bodyWithLanguage = {
          ...body,
          language: this.selectedLanguage,
          visitorId,
          location: location ? [location.lat, location.lon] : null,
          requestTime: new Date().getTime(),
        };
  
        if (loggedUserDetails) {
          bodyWithLanguage = {
            ...this.storage.getStoredUser(),
            ...bodyWithLanguage,
          };
        }
  
        return this.http.post(`${this.baseUrl}${endpoint}`, formData || bodyWithLanguage, options).pipe(
          map((response: any) => {
            if (response?.status === 'success') {
              return returnEntireResponse ? response : response.data;
            } else {
              const errorMsg = response?.msg || response.message || 'Operation failed';
              console.error('API Error:', errorMsg);
              this.messageService.showError(errorMsg);
              return null;
            }
          }),
          catchError((error: any) => {
            const errorMsg = error?.message || 'Operation failed';
            console.error('API Error:', errorMsg);
            this.messageService.showError(errorMsg);
            return of(null);
          })
        );
      })
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
      map((response: any) => {
        if (response && response.status === 'success') {
          return response;
        } else {
          console.error('API Error:', response.message || 'Operation failed');
          this.messageService.showError(response.message || 'Operation failed');
          throw new Error(response.message || 'Operation failed');
        }
      }),
      catchError(error => {
        console.error('API Error:', error.message || 'Operation failed');
        throw error;
      })
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
      map((response: any) => {
        if (response && response.status === 'success') {
          return response;
        } else {
          console.error('API Error:', response.message || 'Operation failed');
          throw new Error(response.message || 'Operation failed');
        }
      }),
      catchError(error => {
        console.error('API Error:', error.message || 'Operation failed');
        throw error;
      })
    );
  }
}
