import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, switchMap, from } from 'rxjs';
import { environment } from '../../environments/environment';
import { LanguageService } from './language.service';
import { StorageService } from '../admin/services/storage.service';
import { MessageService } from '../admin/services/message.service';
import { VisitorsService } from './visitors.service';
import { LocationService } from './location.service';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl = environment.BE_BASE_URL;
  private selectedLanguage = 'te'; // default language

  constructor(
    private http: HttpClient,
    private languageService: LanguageService,
    private storage: StorageService,
    private messageService: MessageService,
    private visitorsService: VisitorsService,
    private locationService: LocationService,
    private cryptoService: CryptoService
  ) {
    // Subscribe to language changes
    this.languageService.currentLang$.subscribe(lang => {
      this.selectedLanguage = lang;
    });
  }

  setLanguage(lang: string) {
    this.selectedLanguage = lang;
  }

  private async decryptIfEncrypted(response: any): Promise<any> {
    if (typeof response === 'string' && response.split('.').length === 3) {
      return await this.cryptoService.decrypt(response);
    } else if (response && typeof response.data === 'string' && response.data.split('.').length === 3) {
      const decryptedData = await this.cryptoService.decrypt(response.data);
      return { ...response, data: decryptedData };
    } else if (response && typeof response.payload === 'string' && response.payload.split('.').length === 3) {
      const decryptedData = await this.cryptoService.decrypt(response.payload);
      return { ...response, payload: decryptedData };
    } else if (response && typeof response.bundle === 'string' && response.bundle.split('.').length === 3) {
      const decryptedData = await this.cryptoService.decrypt(response.bundle);
      return { ...response, bundle: decryptedData, ...decryptedData };
    }
    return response;
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
      switchMap(async (response: any) => {
        const decRes = await this.decryptIfEncrypted(response);
        if (decRes && decRes.status === 'success' && decRes?.data) {
          return decRes?.data;
        } else {
          console.error('API Error:', decRes.message || 'Operation failed');
          throw new Error(decRes.message || 'Operation failed');
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
    returnEntireResponse?: boolean, baseApiUrl?: string
  ): Observable<any> {
    const options: any = {};
    if (headers) {
      options.headers = headers;
    }

    // Get visitorId (sync) and location (async)
    const visitorId = this.visitorsService.getOrCreateVisitorId();

    return from(this.locationService.getLocation()).pipe(
      switchMap((location) => {
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

        return from(this.cryptoService.encrypt(bodyWithLanguage)).pipe(
          switchMap((encryptedBody) => {
            const finalBody = formData ? formData : { payload: encryptedBody };
            return this.http.post(`${baseApiUrl || this.baseUrl}${endpoint}`, finalBody, options).pipe(
              switchMap(async (response: any) => {
                const decResOriginal = await this.decryptIfEncrypted(response);
                const decRes = await decResOriginal.payload;
                console.log('decRes', decRes);
                // Handle both wrapped {status, data} and flat objects
                const isSuccess = decRes?.status === 'success' || (decRes && !decRes.status);

                if (isSuccess) {
                  return returnEntireResponse ? decRes : (decRes.data || decRes);
                } else {
                  const errorMsg = decRes?.msg || decRes?.message || 'Operation failed';
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

    return from(this.cryptoService.encrypt(bodyWithLanguage)).pipe(
      switchMap((encryptedBody) => {
        const finalBody = { payload: encryptedBody };
        return this.http.put(`${this.baseUrl}${endpoint}`, finalBody, options).pipe(
          switchMap(async (response: any) => {
            const decRes = await this.decryptIfEncrypted(response);
            if (decRes && decRes.status === 'success') {
              return decRes;
            } else {
              console.error('API Error:', decRes.message || 'Operation failed');
              this.messageService.showError(decRes.message || 'Operation failed');
              throw new Error(decRes.message || 'Operation failed');
            }
          }),
          catchError(error => {
            console.error('API Error:', error.message || 'Operation failed');
            throw error;
          })
        );
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
      switchMap(async (response: any) => {
        const decRes = await this.decryptIfEncrypted(response);
        if (decRes && decRes.status === 'success') {
          return decRes;
        } else {
          console.error('API Error:', decRes.message || 'Operation failed');
          throw new Error(decRes.message || 'Operation failed');
        }
      }),
      catchError(error => {
        console.error('API Error:', error.message || 'Operation failed');
        throw error;
      })
    );
  }

  /**
   * Generic PATCH request method
   * @param endpoint - API endpoint
   * @param body - Request body
   * @param headers - Optional custom headers
   * @returns Observable of type any
   */
  patch(endpoint: string, body: any = {}, headers?: HttpHeaders): Observable<any> {
    const options: any = {};

    if (headers) {
      options.headers = headers;
    }

    const bodyWithLanguage = {
      ...body,
      language: this.selectedLanguage,
    };

    return from(this.cryptoService.encrypt(bodyWithLanguage)).pipe(
      switchMap((encryptedBody) => {
        const finalBody = { payload: encryptedBody };
        return this.http.patch(`${this.baseUrl}${endpoint}`, finalBody, options).pipe(
          switchMap(async (response: any) => {
            const decRes = await this.decryptIfEncrypted(response);
            if (decRes && decRes.status === 'success') {
              return decRes.data ?? decRes;
            } else {
              console.error('API Error:', decRes.message || 'Operation failed');
              this.messageService.showError(decRes.message || 'Operation failed');
              throw new Error(decRes.message || 'Operation failed');
            }
          }),
          catchError(error => {
            console.error('API Error:', error.message || 'Operation failed');
            throw error;
          })
        );
      })
    );
  }
}
